rm -r build && \
cd ../client && \
npm run build && \
mv build ../server/build && \
cd ../server && \
cp ../client/src/css/theme/App.css ./build/static/css && \
cp ../client/src/css/theme/App-night.css ./build/static/css