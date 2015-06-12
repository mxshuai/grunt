// ��װ����
module.exports = function(grunt) {
 
  // LiveReload��Ĭ�϶˿ںţ���Ҳ���Ըĳ�����Ҫ�Ķ˿ں�
    var lrPort = 35729;
    // ʹ��connect-livereloadģ�飬����һ����LiveReload�ű�
    // &lt;script src=&quot;http://127.0.0.1:35729/livereload.js?snipver=1&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    // ʹ�� middleware(�м��)���ͱ���ر� LiveReload ����������
    var lrMiddleware = function(connect, options) {
        return [
            // �ѽű���ע�뵽��̬�ļ���
            lrSnippet,
            // ��̬�ļ���������·��
            connect.static(options.base[0]),
            // ����Ŀ¼���(�൱��IIS�е�Ŀ¼���)
            connect.directory(options.base[0])
        ];
    };
 
  // ��������,���в����������Ϣ
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
	 connect: {
            options: {
                // �������˿ں�
                port: 8000,
                // ��������ַ(����ʹ��������localhost��Ҳ��ʹ��IP)
                hostname: '192.168.1.119',
                // ����·��(Ĭ��Ϊ. ����Ŀ¼) ע��ʹ��'.'��'..'Ϊ·����ʱ�����ܻ᷵��403 Forbidden. ��ʱ����ֵ��Ϊ���·�� �磺/grunt/reloard��
                base: '.'
            },
            livereload: {
                options: {
                    // ͨ��LiveReload�ű�����ҳ�����¼��ء�
                    middleware: lrMiddleware
                }
            }
        },
        // ͨ��watch�����������ļ��Ƿ��и���
        watch: {
            client: {
                // ���ǲ���Ҫ���ö��������watch�����Ѿ��ڽ�LiveReload�����ˢ�µĴ���Ƭ�Ρ�
                options: {
                    livereload: lrPort
                },
                // '**' ��ʾ�������е���Ŀ¼
                // '*' ��ʾ�������е��ļ�
                files: ['*.html', 'css/*', 'js/*', 'images/**/*']
            }
        },

       // jshint�����������Ϣ
	 jshint: {
            options: {
                //�����Ű���
                curly: true,
                //���ڼ����ͣ�ʹ��===��!==��������==��!=
                eqeqeq: true,
                //��������ĸ��д�ĺ������������ࣩ��ǿ��ʹ��new
                newcap: true,
                //����arguments.caller��arguments.callee
                noarg: true,
                //��������ʹ��aaa.bbb������aaa['bbb']
                sub: true,
                //��������δ�������
                undef: true,
                //����������if(a = 0)�����Ĵ���
                boss: true,
                //ָ�����л���Ϊnode.js
                node: true
            },
            //������������
            files: {
                src: ['js/*.js']
            }
        },
	  // htmlhint�����������Ϣ
		htmlhint: {
		build: {
			options: {
				'tag-pair': true,
				'tagname-lowercase': true,
				'attr-lowercase': true,
				'attr-value-double-quotes': true,
				'spec-char-escape': true,
				'id-unique': true,
				'head-script-disabled': true,
			},
        src: ['*.html']
			}
		},
		// csslint�����������Ϣ
		csslint: {
			  strict: {
				options: {
				  import: 2
				},
				src: ['css/*.css']
			  },
			  lax: {
				options: {
				  import: false
				},
				src: ['css/*.css']
			  }
			},
       
		
    // imagemin�����������Ϣ
    imagemin:{
        dynamic:{
                files:[{
                        expand: true,
                        cwd:    'images/',
                        src:    ['**/*.{png,jpg,gif}'],
                        dest:   'build/public/images/'
                }]
        }
    },
	// mincss�����������Ϣ
	cssmin: {
			  target: {
				files: [{
				  expand: true,
				  cwd: 'css',
				  src: ['*.css', '!*.min.css'],
				  dest: 'build/public/css',
				  ext: '.css'
				}]
			  }
			},
	// htmlmin�����������Ϣ		
	htmlmin: {
				dist: {
					options: {
						removeComments: true,
						collapseWhitespace: true
					},
					files: [{
						expand: true,
						src: '*.html',
						dest: 'build/public/'
					}]
				}
			},
	// uglify�����������Ϣ
    uglify: {
    buildall: {//����������ԭ�ļ��ṹѹ��js�ļ���������JS�ļ�
                files: [{
                    expand:true,
                    cwd:'js',//jsĿ¼��
                    src:'**/*.js',//����js�ļ�
                    dest: 'build/public/js'//�������Ŀ¼��
                }]
            },
    },
	//ȥ��δ�õ�css
	 uncss: {
			dist: {
				options: {
					ignore: [/js-.+/, '.special-class'],
					ignoreSheets: [/fonts.googleapis/],
				},
				files: {
					'dist/css/unused-removed.css': ['src/index.html', 'src/contact.html', 'src/service.html']
				}
			}
		},

 	sprite: {
    options: {
        // sprite����ͼԴ�ļ��У�ֻ��ƥ���·���Żᴦ��Ĭ�� images/slice/
        imagepath: 'build/public/images/',
        // ӳ��CSS�б���·����֧�ֺ��������飬Ĭ��Ϊ null
        imagepath_map: null,
        // ѩ��ͼ���Ŀ¼��ע�⣬�Ḳ��֮ǰ�ļ���Ĭ�� images/
        spritedest: 'build/temp/images/',
        // �滻��ı���·����Ĭ�� ../images/
        spritepath: '../images/',
        // ��ͼƬ���࣬�������Ϊ��������ǿ��+1�Ա�֤���ɵ�2xͼƬΪż����ߣ�Ĭ�� 0
        padding: 30,
        // �Ƿ�ʹ�� image-set ��Ϊ2xͼƬʵ�֣�Ĭ�ϲ�ʹ��
        useimageset: false,
        // �Ƿ���ʱ���Ϊ�ļ��������µ�ѩ��ͼ�ļ������������ע������֮ǰ���ɵ��ļ���Ĭ�ϲ��������ļ�
        newsprite: false,
        // ��ѩ��ͼ׷��ʱ�����Ĭ�ϲ�׷��
        spritestamp: true,
        // ��CSS�ļ�ĩβ׷��ʱ�����Ĭ�ϲ�׷��
        cssstamp: true,
        // Ĭ��ʹ�ö��������������㷨
        algorithm: 'top-down',
        // Ĭ��ʹ��`pixelsmith`ͼ��������
        engine: 'pixelsmith'
    },
    autoSprite: {
        files: [{
            // ���ö�̬��չ
            expand: true,
            // css�ļ�Դ���ļ���
            cwd: 'build/public/css/',
            // ƥ�����
            src: '*.css',
            // ����css��sprite��·����ַ
            dest: 'build/temp/css/',
            // ������css��
            ext: '.sprite.css'
        }]
    }
}
/* sprite: {
      allslice: {
          files: [
              {
                  //���ö�̬��չ
                  expand: true,
                  // css�ļ�Դ���ļ���
                  cwd: 'css',
                  // ƥ�����
                  src: ['*.css'],
                  //����css��sprite��·����ַ
                  dest: 'tmp/',
                  // ������css��
                  ext: '.sprite.css'
              }
          ],
          options: {
              // Ĭ��ʹ��GMͼ��������
              'engine': 'gm',
              // Ĭ��ʹ�ö��������������㷨
              'algorithm': 'binary-tree',
              // Ĭ�ϸ�ѩ��ͼ׷��ʱ���
              'imagestamp':true,
              // Ĭ�ϸ���ʽ�ļ�׷��ʱ���
              'cssstamp':true

          }
      }
  }*/

 
 
  });
 
  // ����grunt���ǽ�ʹ�ò��
  grunt.loadNpmTasks('grunt-contrib-connect');
   grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-htmlhint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-css-sprite');
  grunt.loadNpmTasks('grunt-sprite');
 
  // ����grunt���������ն�������gruntʱ��Ҫ��Щʲô
    grunt.registerTask('check', ['csslint','htmlhint','jshint']);
	grunt.registerTask('youhua', ['sprite','uncss']);
	grunt.registerTask('aaa', ['sprite']);
    grunt.registerTask('public', ['uglify', 'imagemin','cssmin','htmlmin']);
	grunt.registerTask('live', ['connect', 'watch']);
 
};