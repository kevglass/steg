echo "Last Version";
cat version.txt
echo "";
read -p "New Version:" version

cp -r site/latest site/$version
mv site/$version/steg.d.ts site/$version/steg-$version.d.ts
scp -r site/* kevglass@cokeandcode.com:cokeandcode.com/steg
