mkdir ./deploy-git
cd ./deploy-git
git init
git config --global push.default matching
git config --global user.email "${GitMail}"
git config --global user.name "${GitUser}"
git remote add origin ${GitRepo}
git pull origin master
rm -rf ./*
cp -rf ../dist/* ./
git add --all .
git commit -m "Travis CI Auto Builder"
git push --quiet --force origin HEAD:master