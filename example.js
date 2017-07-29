/**
 * steamer-plugin-mock 样例mock文件
 * 
 * 推荐使用faker: https://github.com/marak/Faker.js/
 * 或者Mock: http://mockjs.com/
 * 来生成随机的id、头像、邮箱、电话号码等常用假数据
 */

var getRandomColor = function(){
  return  '#' +
    (function(color){
    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
      && (color.length == 6) ?  color : arguments.callee(color);
  })('');
}

module.exports = () => {
    let data = {

        steamer: [
            {
                name: 'steamerjs',
                github: 'https://github.com/steamerjs/steamerjs',
            },{
                name: 'steamer-plugin-kit',
                github: 'https://github.com/steamerjs/steamer-plugin-kit'
            },{
                name: 'steamer-react',
                github: 'https://github.com/steamerjs/steamer-react/'
            },{
                name: 'steamer-vue',
                github: 'https://github.com/steamerjs/steamer-vue/'
            },{
                name: 'steamer-simple',
                github: 'https://github.com/steamerjs/steamer-simple/'
            },{
                name: 'steamer-react-component',
                github: 'https://github.com/steamerjs/steamer-react-component/'
            },{
                name: 'steamer-plugin-mock',
                github: 'https://github.com/steamerjs/steamer-plugin-mock/'
            }
        ],
        colors: []
    };

    for(let id = 0; id < 20; id++) {
        data.colors.push({
            id: id,
            color: getRandomColor()
        })
    }
    return data;
}
