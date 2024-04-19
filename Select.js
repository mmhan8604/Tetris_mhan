//載入遊戲
function loadGameScript(scriptUrl) {
    // 移除現有遊戲
    const existingScript = document.getElementById('game-script');
    if (existingScript) {
        existingScript.remove();
    }
    // 創建新遊戲
    const script = document.createElement('script');
    script.id = 'game-script';
    script.src = scriptUrl;
    document.head.appendChild(script);
}

// 隱藏難度選擇
function hideDifficultySelector() {    
    document.getElementById('difficulty-container').style.display = 'none';
}

// 載入簡單版
document.getElementById('easy-mode').addEventListener('click', function() {
    loadGameScript('Easy.js'); 
    hideDifficultySelector();
});

// 載入困難版
document.getElementById('hard-mode').addEventListener('click', function() {
    loadGameScript('Hard.js'); 
    hideDifficultySelector();
});
