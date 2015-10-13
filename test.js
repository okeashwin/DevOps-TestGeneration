var subject = require('./subject.js')
var mock = require('mock-fs');
subject.inc(0,undefined);
subject.inc(0,10);
subject.inc(-10,undefined);
subject.inc(-10,10);
subject.weird(7,0,42,"strict");
subject.weird(7,0,42,"astrict");
subject.weird(7,0,42,"werwtestString");
subject.weird(7,0,42,"testString");
subject.weird(7,0,32,"strict");
subject.weird(7,0,32,"astrict");
subject.weird(7,0,32,"werwtestString");
subject.weird(7,0,32,"testString");
subject.weird(7,-10,42,"strict");
subject.weird(7,-10,42,"astrict");
subject.weird(7,-10,42,"werwtestString");
subject.weird(7,-10,42,"testString");
subject.weird(7,-10,32,"strict");
subject.weird(7,-10,32,"astrict");
subject.weird(7,-10,32,"werwtestString");
subject.weird(7,-10,32,"testString");
subject.weird(710,0,42,"strict");
subject.weird(710,0,42,"astrict");
subject.weird(710,0,42,"werwtestString");
subject.weird(710,0,42,"testString");
subject.weird(710,0,32,"strict");
subject.weird(710,0,32,"astrict");
subject.weird(710,0,32,"werwtestString");
subject.weird(710,0,32,"testString");
subject.weird(710,-10,42,"strict");
subject.weird(710,-10,42,"astrict");
subject.weird(710,-10,42,"werwtestString");
subject.weird(710,-10,42,"testString");
subject.weird(710,-10,32,"strict");
subject.weird(710,-10,32,"astrict");
subject.weird(710,-10,32,"werwtestString");
subject.weird(710,-10,32,"testString");
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":"text content"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"},"pathContent":{"file1":"text content"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":"text content"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"pathContent":{"file1":"text content"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":""},"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content"},"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":""},"path/fileExists":{"file1":"text content2"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content"},"path/fileExists":{"file1":"text content2"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":""},"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content"},"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":"text content"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":"text content2"}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""},"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"path/fileExists":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({"pathContent":{"file1":""}});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
mock({});
	subject.fileTest('path/fileExists','pathContent/file1');
mock.restore();
subject.format('','','');
subject.format('','',{"normalize":true});
subject.blackListNumber('2121234567');
subject.blackListNumber('3121234567');
