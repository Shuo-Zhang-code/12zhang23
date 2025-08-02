// 投篮小游戏基础玩法

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('basketball-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const basketY = 120; // 篮筐Y坐标
    const basketX = 140; // 篮筐X坐标
    const basketWidth = 100;
    const basketHeight = 20;
    const ballRadius = 18;
    const LOTTERY_SCORE = 5; // 达到该分数弹出抽奖

    // 图片资源加载
    const ballImg = new Image();
    ballImg.src = 'basketball.png'; // 篮球图片路径
    const basketImg = new Image();
    basketImg.src = 'basket.png'; // 篮筐图片路径
    // 在图片资源加载部分添加
    const bgImg = new Image();
    bgImg.src = 'background.png'; // 背景图片路径，确保文件存在于对应位置

    // 让分数变量全局可访问，方便wheel.js重置
    window.score = 0;
    let ball = {
        x: canvas.width / 2,
        y: canvas.height - 60,
        vx: 0,
        vy: 0,
        isMoving: false
    };



    // 绘制篮筐（使用图片）
    function drawBasket() {
        // 调整坐标和尺寸以适应实际图片
        ctx.drawImage(
            basketImg, 
            basketX - 20, 
            basketY - 40, 
            basketWidth + 40, 
            basketHeight + 60
        );
    }
    // 绘制背景


    // 绘制篮球（使用图片）
    function drawBall() {
        ctx.drawImage(
            ballImg, 
            ball.x - ballRadius, 
            ball.y - ballRadius, 
            ballRadius * 2, 
            ballRadius * 2
        );
    }

    // 重置篮球到初始位置
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 60;
        ball.vx = 0;
        ball.vy = 0;
        ball.isMoving = false;
    }

    // 判断是否进筐
    function checkScore() {
        // 球心在篮筐矩形内（调整碰撞检测区域适应图片）
        if (
            ball.y - ballRadius < basketY + basketHeight &&
            ball.y + ballRadius > basketY &&
            ball.x > basketX &&
            ball.x < basketX + basketWidth
        ) {
            window.score++;
            scoreEl.textContent = window.score;

            // 达到抽奖分数，弹出抽奖弹窗
            if (window.score >= LOTTERY_SCORE) {
                setTimeout(() => {
                    const modal = document.getElementById('lottery-modal');
                    if (modal) modal.classList.remove('hidden');
                }, 300);
            }

            resetBall();
        } else if (ball.y < 0 || ball.x < 0 || ball.x > canvas.width || ball.y > canvas.height) {
            // 没进筐，出界重置
            resetBall();
        }
    }

    // 动画循环
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBasket();
        drawBall();

        if (ball.isMoving) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vy += 0.4; // 重力加速度
            checkScore();
        }

        requestAnimationFrame(loop);
    }

    // 投篮操作
    let startX, startY, isDragging = false;
    canvas.addEventListener('mousedown', function(e) {
        if (ball.isMoving) return;
        isDragging = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });
    canvas.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        // 可加拖拽轨迹显示
    });
    canvas.addEventListener('mouseup', function(e) {
        if (!isDragging) return;
        isDragging = false;
        const dx = e.offsetX - startX;
        const dy = e.offsetY - startY;
        // 速度与拖拽方向相反
        ball.vx = dx * 0.15;
        ball.vy = dy * 0.15;
        ball.isMoving = true;
    });

    // 兼容移动端
    canvas.addEventListener('touchstart', function(e) {
        if (ball.isMoving) return;
        isDragging = true;
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        startX = touch.clientX - rect.left;
        startY = touch.clientY - rect.top;
    });
    canvas.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;
        const touch = e.changedTouches[0];
        const rect = canvas.getBoundingClientRect();
        const endX = touch.clientX - rect.left;
        const endY = touch.clientY - rect.top;
        const dx = endX - startX;
        const dy = endY - startY;
        ball.vx = dx * 0.15;
        ball.vy = dy * 0.15;
        ball.isMoving = true;
    });

    // 初始化
    resetBall();
    loop();
});