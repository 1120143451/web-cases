window.onload = function () {
    /* 1. 顶部搜索 */
    search();
    /* 2. 轮播图 */
    banner();
    /* 3. 倒计时 */
    downTime();
};
/* 顶部搜索 */
var search = function () {
    /* 1.默认固定顶部透明背景 */
    let searchBox = document.querySelector('.jd_search_box');
    let banner = document.querySelector('.jd_banner');
    let height = banner.offsetHeight;
    /* 监听页面滚动事件 */
    window.onscroll = function () {
        /*console.log(document.body.scrollTop);
        console.log(document.documentElement.scrollTop);
        console.log(window.pageYOffset);*/
        let scrollTop = document.documentElement.scrollTop;
        /*console.log(scrollTop);*/
        /* 默认的透明度 */
        let opacity = 0;
        if (scrollTop < height) {
            /* 2.当页面滚动的时候---随着页面卷曲的高度变大透明度变大 */
            opacity = scrollTop / height * 0.85;
        } else {
            /* 3.当页面滚动的时候---超过某个高度的时候透明度不变 */
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201, 21, 35, ' + opacity + ')';
    }
};
/* 轮播图 */
var banner = function () {
    /* 1. 自动轮播且无缝 （定时器，过渡） */
    /* 2. 点要随着图片的轮播而改变 （根据索引切换） */
    /* 3. 滑动效果 （利用 touch 事件） */
    /* 4. 滑动结束的时候  如果滑动的距离不超过屏幕的1/3  吸附回去 （过渡）*/
    /* 5. 滑动结束的时候 如果滑动的距离超过屏幕的1/3 切换上一张，下一张 （根据滑动的方向，过渡） */

    /* 轮播图 */
    let banner = document.querySelector('.jd_banner');
    /* 屏幕的宽度 */
    let width = banner.offsetWidth;
    /* 图片容器 */
    let imageBox = banner.querySelector('ul:first-child');
    /* 点容器 */
    let pointBox = banner.querySelector('ul:last-child');
    /* 所有的点 */
    let points = pointBox.querySelectorAll('li');

    let addTransition = function () {
        imageBox.style.transition = 'all 0.2s';
        imageBox.style.webkitTransition = 'all 0.2s';
    };

    let removeTransition = function () {
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    };

    let setTranslateX = function (translateX) {
        imageBox.style.transform = 'translateX(' + translateX + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
    };

    /* 程序的核心 index */
    let index = 1;
    let timer;
    let setTime = function () {
        timer = setInterval(function () {
            index++;
            /* 加过渡 */
            addTransition();
            /* 做位移 */
            setTranslateX(-index * width);
        }, 1000);
    };
    setTime();
    /* 需要等最后一张动画结束去判断 是否瞬间定位到第一张 */
    imageBox.addEventListener('transitionend', function () {
        /* 自动滚动的无缝 */
        if (index >= 9) {
            index = 1;
            /* 瞬间定位 */
            /* 清过渡 */
            removeTransition();
            /* 做位移 */
            setTranslateX(-index * width);
        }
        /* 滑动的时候也要无缝 */
        else if (index <= 0) {
            index = 8;
            /* 清过渡 */
            removeTransition();
            /* 做位移 */
            setTranslateX(-index * width);
        }

        /*  根据索引设置点 */
        /* 此时此刻 index 的取值范围（1-8） */
        /* 点的索引 index-1 */
        setPoint();
    });

    /* 设置点的方法 */
    let setPoint = function () {
        /* index 1-8 */
        points.forEach(function (node, item) {
            /* 清除样式 */
            node.classList.remove('now');
            /* 添加样式 */
            if (index - 1 == item) {
                node.classList.add('now');
            }
        });
    };

    /* 绑定事件 */
    let startX = 0;
    let distanceX = 0;
    let isMove = false;
    imageBox.addEventListener('touchstart', function (e) {
        /* 清除定时器 */
        clearInterval(timer);
        /* 记录起始位置的 x 坐标 */
        startX = e.touches[0].clientX;
    });
    imageBox.addEventListener('touchmove', function (e) {
        /* 记录滑动过程当中的 x 坐标 */
        let moveX = e.touches[0].clientX;
        /* 计算位移 有正负方向 */
        distanceX = moveX - startX;
        /* 计算目标元素的位移 不用管正负 */
        /* 元素将要的定位=当前定位+手指移动的距离*/
        let translateX = -index * width + distanceX;
        /* 滑动 ---> 元素随着手指的滑动做位置的改变 */
        removeTransition();
        setTranslateX(translateX);
        isMove = true;
    });
    imageBox.addEventListener('touchend', function (e) {
        /* 4. 5. 实现 */
        if (isMove) {
            /* 要使用移动的距离 */
            if (Math.abs(distanceX) < width / 3) {
                /* 吸附 */
                addTransition();
                setTranslateX(-index * width);
            } else {
                /* 切换 */
                /* 右滑动 上一张 */
                if (distanceX > 0) {
                    index --;
                }
                /* 左滑动 下一张 */
                else {
                    index ++;
                }
                /* 根据 Index 去动画的移动 */
                addTransition();
                setTranslateX(-index * width);
            }
        }
        /* 最好做一次参数的重置 */
        startX = 0;
        distanceX = 0;
        isMove=false;
        /* 加上定时器 */
        clearInterval(timer);
        setTime();
    });
};
/* 倒计时 */
var downTime = function () {
    /* 倒计时的时间 */
    let time = 2*60*60; /* 两小时 */
    /* 时间盒子 */
    let spans = document.querySelector('.sk_time').querySelectorAll('span');
    /* 每一秒去更新显示的时间 */
    let timer = setInterval(function (){
        time --;
        /* time 格式还是秒需要转换 */
        /* Math.floor 函数取整 */
        let h = Math.floor(time/3600); /* 3600 秒等于 1 小时 */
        let m = Math.floor(time%3600/60); /* 60 秒等于 1 分钟 */
        let s = time%60;

        spans[0].innerHTML = Math.floor(h/10);
        spans[1].innerHTML = h%10;

        spans[3].innerHTML = Math.floor(m/10);
        spans[4].innerHTML = m%10;

        spans[6].innerHTML = Math.floor(s/10);
        spans[7].innerHTML = s%10;

        if (time <= 0 ) {
            clearInterval(timer);
        }
    }, 1000);
};