function loadGameScript(scriptUrl) {
    // 移除現有腳本
    const existingScript = document.getElementById('game-script');
    if (existingScript) {
        existingScript.remove();
    }
    // 創建新腳本
    const script = document.createElement('script');
    script.id = 'game-script';
    script.src = scriptUrl;
    document.head.appendChild(script);
}

function hideDifficultySelector() {
    // 隱藏難度選擇
    document.getElementById('difficulty-container').style.display = 'none';
}

document.getElementById('easy-mode').addEventListener('click', function() {
    loadGameScript('Easy.js'); // 載入簡單版
    hideDifficultySelector();
});

document.getElementById('hard-mode').addEventListener('click', function() {
    loadGameScript('Hard.js'); // 載入困難版
    hideDifficultySelector();
});
