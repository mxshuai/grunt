// 包装函数
module.exports = function(grunt) {
 
  // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    // 使用connect-livereload模块，生成一个与LiveReload脚本
    // &lt;script src=&quot;http://127.0.0.1:35729/livereload.js?snipver=1&quot; type=&quot;text/javascript&quot;&gt;&lt;/script&gt;
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
    var lrMiddleware = function(connect, options) {
        return [
            // 把脚本，注入到静态文件中
            lrSnippet,
            // 静态文件服务器的路径
            connect.static(options.base[0]),
            // 启用目录浏览(相当于IIS中的目录浏览)
            connect.directory(options.base[0])
        ];
    };
 
  // 任务配置,所有插件的配置信息
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
	 connect: {
            options: {
                // 服务器端口号
                port: 8000,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                hostname: '192.168.1.119',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: '.'
            },
            livereload: {
                options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: lrMiddleware
                }
            }
        },
        // 通过watch任务，来监听文件是否有更改
        watch: {
            client: {
                // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
                options: {
                    livereload: lrPort
                },
                // '**' 表示包含所有的子目录
                // '*' 表示包含所有的文件
                files: ['*.html', 'css/*', 'js/*', 'images/**/*']
            }
        },

       // jshint插件的配置信息
	 jshint: {
            options: {
                //大括号包裹
                curly: true,
                //对于简单类型，使用===和!==，而不是==和!=
                eqeqeq: true,
                //对于首字母大写的函数（声明的类），强制使用new
                newcap: true,
                //禁用arguments.caller和arguments.callee
                noarg: true,
                //对于属性使用aaa.bbb而不是aaa['bbb']
                sub: true,
                //查找所有未定义变量
                undef: true,
                //查找类似与if(a = 0)这样的代码
                boss: true,
                //指定运行环境为node.js
                node: true
            },
            //具体任务配置
            files: {
                src: ['js/*.js']
            }
        },
	  // htmlhint插件的配置信息
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
		// csslint插件的配置信息
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
       
		
    // imagemin插件的配置信息
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
	// mincss插件的配置信息
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
	// htmlmin插件的配置信息		
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
	// uglify插件的配置信息
    uglify: {
    buildall: {//任务三：按原文件结构压缩js文件夹内所有JS文件
                files: [{
                    expand:true,
                    cwd:'js',//js目录下
                    src:'**/*.js',//所有js文件
                    dest: 'build/public/js'//输出到此目录下
                }]
            },
    },
	//去除未用的css
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
        // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
        imagepath: 'build/public/images/',
        // 映射CSS中背景路径，支持函数和数组，默认为 null
        imagepath_map: null,
        // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
        spritedest: 'build/temp/images/',
        // 替换后的背景路径，默认 ../images/
        spritepath: '../images/',
        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
        padding: 30,
        // 是否使用 image-set 作为2x图片实现，默认不使用
        useimageset: false,
        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
        newsprite: false,
        // 给雪碧图追加时间戳，默认不追加
        spritestamp: true,
        // 在CSS文件末尾追加时间戳，默认不追加
        cssstamp: true,
        // 默认使用二叉树最优排列算法
        algorithm: 'top-down',
        // 默认使用`pixelsmith`图像处理引擎
        engine: 'pixelsmith'
    },
    autoSprite: {
        files: [{
            // 启用动态扩展
            expand: true,
            // css文件源的文件夹
            cwd: 'build/public/css/',
            // 匹配规则
            src: '*.css',
            // 导出css和sprite的路径地址
            dest: 'build/temp/css/',
            // 导出的css名
            ext: '.sprite.css'
        }]
    }
}
/* sprite: {
      allslice: {
          files: [
              {
                  //启用动态扩展
                  expand: true,
                  // css文件源的文件夹
                  cwd: 'css',
                  // 匹配规则
                  src: ['*.css'],
                  //导出css和sprite的路径地址
                  dest: 'tmp/',
                  // 导出的css名
                  ext: '.sprite.css'
              }
          ],
          options: {
              // 默认使用GM图像处理引擎
              'engine': 'gm',
              // 默认使用二叉树最优排列算法
              'algorithm': 'binary-tree',
              // 默认给雪碧图追加时间戳
              'imagestamp':true,
              // 默认给样式文件追加时间戳
              'cssstamp':true

          }
      }
  }*/

 
 
  });
 
  // 告诉grunt我们将使用插件
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
 
  // 告诉grunt当我们在终端中输入grunt时需要做些什么
    grunt.registerTask('check', ['csslint','htmlhint','jshint']);
	grunt.registerTask('youhua', ['sprite','uncss']);
	grunt.registerTask('aaa', ['sprite']);
    grunt.registerTask('public', ['uglify', 'imagemin','cssmin','htmlmin']);
	grunt.registerTask('live', ['connect', 'watch']);
 
};