#!/usr/bin/env sh

cd ./build/web-mobile # 進入生成的資料夾

# 修正 virtual_cc
find ./ -depth -type f -name '*_virtual_cc*' -exec bash -c '
    # 修改檔案名稱
    for file; do
        mv "$file" "${file/_virtual_cc/cc}"
    done
' bash {} +

find ./ -type f -exec sed -i 's/_virtual_cc/cc/g' {} +

# 設定 ssh-key 相關資訊
mkdir -p ~/.ssh/
echo "${DEPLOY_KEY}" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan github.com >> ~/.ssh/known_hosts

# 設定 git 相關資訊
msg='來自 GitHub Actions 的自動部署。'
githubUrl=git@github.com:Hundo1018/Tetits.git
git config --global user.name "linyejoe2"
git config --global user.email "linyejoe2@gmail.com"

# 建立一個臨時的 branch
git init
git add -A
git commit -m "${msg}"

# 推送到github
git push -f $githubUrl master:release