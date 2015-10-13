var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var faker = require("faker");
var fs = require("fs");
faker.locale = "en";
var mock = require('mock-fs');
var _ = require('underscore');
var Random = require('random-js');

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
		args = ["subject.js"];
	}
	var filePath = args[0];

	constraints(filePath);

	generateTestCases()

}

var engine = Random.engines.mt19937().autoSeed();

function createConcreteIntegerValue( greaterThan, constraintValue )
{
	if( greaterThan )
		return Random.integer(constraintValue,constraintValue+10)(engine);
	else
		return Random.integer(constraintValue-10,constraintValue)(engine);
}

function Constraint(properties)
{
	this.ident = properties.ident;
	this.expression = properties.expression;
	this.operator = properties.operator;
	this.value = properties.value;
	this.funcName = properties.funcName;
	// Supported kinds: "fileWithContent","fileExists"
	// integer, string, phoneNumber
	this.kind = properties.kind;
}

function fakeDemo()
{
	console.log( faker.phone.phoneNumber() );
	console.log( faker.phone.phoneNumberFormat() );
	console.log( faker.phone.phoneFormats() );
}

var functionConstraints =
{
}

var mockFileLibrary = 
{
	pathExists:
	{
		'path/fileExists': {}
	},
	fileWithContent:
	{
		pathContent: 
		{	
  			file1: 'text content',
		}
	},
	fileWithoutContent:
	{
		pathContent:
		{
			file1: ''
		}
	},
	directoryWithFiles:
	{
		'path/fileExists': 
		{
			file1: 'text content2'
		}
	},
	directoryWithEmptyFiles:
	{
		'path/fileExists':
		{
			file1: ''
		}
	}
};

function cartesianProductOf() {
    return _.reduce(arguments, function(a, b) {
        return _.flatten(_.map(a, function(x) {
            return _.map(b, function(y) {
                return x.concat([y]);
            });
        }), true);
    }, [ [] ]);
};


function generateTestCases()
{

	var content = "var subject = require('./subject.js')\nvar mock = require('mock-fs');\n";
	for ( var funcName in functionConstraints )
	{
		var params = {};
		console.log("Into the constraint processing loop with funcName:"+funcName)

		// initialize params
		for (var i =0; i < functionConstraints[funcName].params.length; i++ )
		{
			var paramName = functionConstraints[funcName].params[i];
			//params[paramName] = '\'' + faker.phone.phoneNumber()+'\'';
			console.log("paramName : "+paramName);
			//params[paramName] = '\'\'';
			params[paramName] = new Array();
		}

		//console.log( params );

		// update parameter values based on known constraints.
		var constraints = functionConstraints[funcName].constraints;
		// Handle global constraints...
		var fileWithContent = _.some(constraints, {kind: 'fileWithContent' });
		var pathExists      = _.some(constraints, {kind: 'fileExists' });
		var directoryWithFiles      = _.some(constraints, {kind: 'directoryWithFiles' });
		var directoryWithEmptyFiles      = _.some(constraints, {kind: 'directoryWithEmptyFiles' });
		var fileWithoutContent      = _.some(constraints, {kind: 'fileWithoutContent' });

		// plug-in values for parameters
		for( var c = 0; c < constraints.length; c++ )
		{
			var constraint = constraints[c];
			console.log("Constraints : "+JSON.stringify(constraint))
			if( params.hasOwnProperty( constraint.ident ) )
			{
				params[constraint.ident].push(constraint.value);
				//console.log(params);
			}
		}

		var parametersList = Object.keys(params).map( function(k) {return params[k]; });
		console.log(parametersList);
		cartesianOutput = cartesianProductOf.apply(this, parametersList);
		console.log(cartesianOutput);
		for(var i=0;i<cartesianOutput.length;i++)
		{
			var args = cartesianOutput[i];
			console.log("Args: "+args)
			//if(funcName=='inc' || funcName=='weird')
			{
				content += "subject.{0}({1});\n".format(funcName, args );
			}
		}

		// Prepare function arguments.
		if( pathExists || fileWithContent || directoryWithFiles || directoryWithEmptyFiles || fileWithoutContent)
		{
			var fileArgs = ['\'path/fileExists\'', '\'pathContent/file1\''];
			content += generateMockFsTestCases(pathExists,fileWithContent,!directoryWithFiles, !directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			// Bonus...generate constraint variations test cases....
			content += generateMockFsTestCases(!pathExists,fileWithContent,!directoryWithFiles, !directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,!fileWithContent,!directoryWithFiles, !directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(!pathExists,!fileWithContent,!directoryWithFiles, !directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,fileWithContent,directoryWithFiles, !directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,!fileWithContent,!directoryWithFiles, directoryWithEmptyFiles, fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,fileWithContent,!directoryWithFiles, directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,!fileWithContent,!directoryWithFiles, directoryWithEmptyFiles, !fileWithoutContent, funcName, fileArgs);
			content += generateMockFsTestCases(pathExists,fileWithContent,!directoryWithFiles, !directoryWithEmptyFiles, fileWithoutContent, funcName, fileArgs);

		}
		/*else if(funcName!='inc' && funcName!='weird')
		{
			// Emit simple test case.
			content += "subject.{0}({1});\n".format(funcName, args );
		}
		*/

	}


	fs.writeFileSync('test.js', content, "utf8");

}

function generateMockFsTestCases (pathExists,fileWithContent,directoryWithFiles, directoryWithEmptyFiles, fileWithoutContent, funcName,args) 
{
	var testCase = "";
	// Build mock file system based on constraints.
	var mergedFS = {};
	if( pathExists )
	{
		for (var attrname in mockFileLibrary.pathExists) 
			{ 
				mergedFS[attrname] = mockFileLibrary.pathExists[attrname];
				console.log("//////////pathExists////////////////////////////"+attrname+",,,,,,,,,,,,,,,,,,,,,,,,,,,,"+JSON.stringify(mergedFS[attrname]));
			}
	}
	if( fileWithContent )
	{
		for (var attrname in mockFileLibrary.fileWithContent) 
			{ 
				mergedFS[attrname] = mockFileLibrary.fileWithContent[attrname];
				console.log("///////fileWithContent///////////////////////////////"+attrname+",,,,,,,,,,,,,,,,,,,,,,,,,,,,"+JSON.stringify(mergedFS[attrname])); 
			}
	}
	if( directoryWithFiles )
	{
		for (var attrname in mockFileLibrary.directoryWithFiles) 
			{ 
				mergedFS[attrname] = mockFileLibrary.directoryWithFiles[attrname];
				console.log("///////directoryWithFiles///////////////////////////////"+attrname+",,,,,,,,,,,,,,,,,,,,,,,,,,,,"+JSON.stringify(mergedFS[attrname])); 
			}
	}
	if( directoryWithEmptyFiles )
	{
		for (var attrname in mockFileLibrary.directoryWithEmptyFiles) 
			{ 
				mergedFS[attrname] = mockFileLibrary.directoryWithEmptyFiles[attrname];
				console.log("///////directoryWithEmptyFiles///////////////////////////////"+attrname+",,,,,,,,,,,,,,,,,,,,,,,,,,,,"+JSON.stringify(mergedFS[attrname])); 
			}
	}
	if( fileWithoutContent )
	{
		for (var attrname in mockFileLibrary.fileWithoutContent) 
			{ 
				mergedFS[attrname] = mockFileLibrary.fileWithoutContent[attrname];
				console.log("///////fileWithoutContent///////////////////////////////"+attrname+",,,,,,,,,,,,,,,,,,,,,,,,,,,,"+JSON.stringify(mergedFS[attrname])); 
			}
	}

	console.log(JSON.stringify(mergedFS));
	testCase += 
	"mock(" +
		JSON.stringify(mergedFS)
		+
	");\n";

	testCase += "\tsubject.{0}({1});\n".format(funcName, args );
	testCase+="mock.restore();\n";
	return testCase;
}

function constraints(filePath)
{
   var buf = fs.readFileSync(filePath, "utf8");
	var result = esprima.parse(buf, options);

	traverse(result, function (node) 
	{
		if (node.type === 'FunctionDeclaration') 
		{
			var funcName = functionName(node);
			console.log("Line : {0} Function: {1}".format(node.loc.start.line, funcName ));

			var params = node.params.map(function(p) {return p.name});

			functionConstraints[funcName] = {constraints:[], params: params};

			// Check for expressions using argument.
			traverse(node, function(child)
			{
				if( child.type === 'BinaryExpression' && ( child.operator == "==" || child.operator == "<" || child.operator == "<" || child.operator == ">"))
				{
					if( child.left.type == 'Identifier' && params.indexOf( child.left.name ) > -1)
					{
						// get expression from original source code:
						var expression = buf.substring(child.range[0], child.range[1]);
						var rightHand = buf.substring(child.right.range[0], child.right.range[1])
						console.log("expression:  "+expression+"   rightHand: "+rightHand);
						if(typeof child.right.value == "string")
						{
							if(child.operator == "==" || child.operator == "<")
							{
								otherBranchValue = '"a'+child.right.value + '"';
							}
							else 
							{
								otherBranchValue = '"z'+child.right.value + '"';
							}
						}
						else if(typeof child.right.value == "undefined")
						{
							otherBranchValue = 10;
						}
						else
						{
							if(child.operator == "==" || child.operator == "<")
							{
								otherBranchValue = rightHand - 10;
							}
							else 
							{
								otherBranchValue = rightHand + 10;
							}
						}

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: rightHand,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.name,
								value: otherBranchValue,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}

					else if(child.left.type == "CallExpression" && child.left.callee.property && 
							child.left.callee.property.name == "indexOf" && params.indexOf(child.left.callee.object.name) > -1)
					{
						console.log("Into callExpression BinaryExpression---------------------"+child.left.arguments[0].value);
						// ==true coverage
						var testString = "testString";
						var leftFragment = testString.slice(0,child.right.value);
						var insertFragment = child.left.arguments[0].value;
						var rightFragment = testString.slice(child.right.value);
						var trueSample = '"'+leftFragment+insertFragment+rightFragment+'"';
						var falseSample = '"'+testString+'"';

						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.callee.object.name,
								value: trueSample,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));

						// ==false coverage						
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: child.left.callee.object.name,
								value: falseSample,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}

					// For blackListNumber()
					else if(funcName=="blackListNumber")
					{
						var argumentName = child.left.name;
						var testValue = child.right.value;
						//== true coverage
						//console.log("---------------------BLACKLIST------------------------"+params);
						var trueValue = "'"+testValue+"1234567'";
						// Add 100 to the area code to make it a false Sample
						var falseFragment = parseInt(testValue) + 100;
						if(falseFragment==1000)
						{
							falseFragment = 100;
						}
						var falseValue = "'"+falseFragment.toString()+"1234567'";
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params,
								value: trueValue,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));

						// ==false coverage						
						functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params,
								value: falseValue,
								funcName: funcName,
								kind: "integer",
								operator : child.operator,
								expression: expression
							}));
					}
				}

				if( child.type == "CallExpression" && 
					 child.callee.property &&
					 child.callee.property.name =="readFileSync" )
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								value:  "'pathContent/file1'",
								funcName: funcName,
								kind: "fileWithContent",
								operator : child.operator,
								expression: expression
							}));

							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								value:  "'pathContent/file1'",
								funcName: funcName,
								kind: "fileWithoutContent",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="existsSync")
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  "'path/fileExists'",
								funcName: funcName,
								kind: "fileExists",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}

				if( child.type == "CallExpression" &&
					 child.callee.property &&
					 child.callee.property.name =="readdirSync")
				{
					for( var p =0; p < params.length; p++ )
					{
						if( child.arguments[0].name == params[p] )
						{
							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  "'someDirectory/file1'",
								funcName: funcName,
								kind: "directoryWithFiles",
								operator : child.operator,
								expression: expression
							}));

							functionConstraints[funcName].constraints.push( 
							new Constraint(
							{
								ident: params[p],
								// A fake path to a file
								value:  "'path/fileExists'",
								funcName: funcName,
								kind: "directoryWithEmptyFiles",
								operator : child.operator,
								expression: expression
							}));
						}
					}
				}
			});

			console.log( functionConstraints[funcName]);

		}
	});
}

function traverse(object, visitor) 
{
    var key, child;

    visitor.call(null, object);
    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

function traverseWithCancel(object, visitor)
{
    var key, child;

    if( visitor.call(null, object) )
    {
	    for (key in object) {
	        if (object.hasOwnProperty(key)) {
	            child = object[key];
	            if (typeof child === 'object' && child !== null) {
	                traverseWithCancel(child, visitor);
	            }
	        }
	    }
 	 }
}

function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "";
}


if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

main();
