rm -r build && \
cd ../client && \
sed -i ".bak" '/\.\/css\/theme\/App/d' ./src/App.js && \
npm run build && \
mv build ../server/build && \
cd ../server && \
cp ../client/src/css/theme/App.css ./build/static/css && \
cp ../client/src/css/theme/App-night.css ./build/static/css && \
mv ../client/src/App.js.bak ../client/src/App.js && \
sed -i ".bak" 's/\<\/head\>/\<link href=\"\/static\/css\/App\.css\" id=\"cssTheme\" rel=\"stylesheet\" \/\>\<\/head\>/g' build/index.html && \
rm build/index.html.bak