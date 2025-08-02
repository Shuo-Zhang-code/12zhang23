// 转盘抽奖核心逻辑
document.addEventListener('DOMContentLoaded', function() {
    const spinBtn = document.getElementById('spin-btn');
    const closeModal = document.getElementById('close-modal');
    const lotteryModal = document.getElementById('lottery-modal');
    const prizeResult = document.getElementById('prize-result');
    const wheelCanvas = document.getElementById('wheel-canvas');
    
    // 检查 canvas 是否存在
    if (!wheelCanvas) {
        console.error('wheel-canvas not found!');
        return;
    }
    
    const ctx = wheelCanvas.getContext('2d');
    
    // 检查 context 是否获取成功
    if (!ctx) {
        console.error('Failed to get canvas context!');
        return;
    }

    const prizes = ['一等奖', '二等奖', '三等奖', '谢谢参与', '四等奖', '五等奖'];
    const colors = ['#FFB300', '#FF7043', '#66BB6A', '#29B6F6', '#AB47BC', '#EC407A'];
    const anglePer = (2 * Math.PI) / prizes.length;
    let currentAngle = 0;
    let spinning = false;

    function drawWheel(angle = 0) {
        console.log('drawWheel called with angle:', angle);
        console.log('Canvas size:', wheelCanvas.width, 'x', wheelCanvas.height);
        
        // 清空画布
        ctx.clearRect(0, 0, 300, 300);
        
        // 绘制背景圆
        ctx.beginPath();
        ctx.arc(150, 150, 140, 0, 2 * Math.PI);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        
        // 绘制扇区
        for (let i = 0; i < prizes.length; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 140, i * anglePer + angle, (i + 1) * anglePer + angle);
            ctx.closePath();
            ctx.fillStyle = colors[i];
            ctx.fill();
            ctx.restore();

            // 奖品文字
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(i * anglePer + angle + anglePer / 2);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(prizes[i], 90, 5);
            ctx.restore();
        }
        
        // 画中心圆
        ctx.beginPath();
        ctx.arc(150, 150, 40, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#FF9800';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // 中心文字
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#FF9800';
        ctx.textAlign = 'center';
        ctx.fillText('抽奖', 150, 155);
        
        // 画指针
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(150, 10);
        ctx.lineTo(140, 40);
        ctx.lineTo(160, 40);
        ctx.closePath();
        ctx.fillStyle = '#FF9800';
        ctx.fill();
        ctx.restore();
        
        console.log('Wheel drawn successfully');
    }

    function spinWheel() {
        if (spinning) return;
        spinning = true;
        prizeResult.classList.add('hidden');
        
        const prizeIndex = Math.floor(Math.random() * prizes.length);
        const targetAngle = (3 * Math.PI / 2) - (prizeIndex * anglePer) - anglePer / 2;
        const totalRotate = 6 * 2 * Math.PI + targetAngle - currentAngle % (2 * Math.PI);
        const duration = 3500;
        const start = performance.now();
        
        function animate(now) {
            const elapsed = now - start;
            let progress = Math.min(elapsed / duration, 1);
            progress = 1 - Math.pow(1 - progress, 3);
            const angle = currentAngle + totalRotate * progress;
            drawWheel(angle);
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentAngle = angle % (2 * Math.PI);
                spinning = false;
                prizeResult.textContent = '恭喜你，获得' + prizes[prizeIndex] + '!';
                prizeResult.classList.remove('hidden');
            }
        }
        requestAnimationFrame(animate);
    }

    // 监听弹窗显示，确保弹窗显示时才绘制转盘
    if (lotteryModal) {
        console.log('Setting up observer for lottery modal');
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (!lotteryModal.classList.contains('hidden')) {
                        console.log('Modal shown, drawing wheel');
                        setTimeout(() => {
                            drawWheel(currentAngle);
                        }, 100);
                    }
                }
            });
        });
        observer.observe(lotteryModal, { attributes: true, attributeFilter: ['class'] });
    }

    if (spinBtn) {
        spinBtn.addEventListener('click', function() {
            console.log('Spin button clicked');
            spinWheel();
        });
    }
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            lotteryModal.classList.add('hidden');
            prizeResult.classList.add('hidden');
            // 关闭弹窗时重置分数
            window.score = 0;
            document.getElementById('score').textContent = '0';
        });
    }
    
    console.log('Wheel.js loaded successfully');
});