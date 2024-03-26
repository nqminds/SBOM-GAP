#!/bin/sh

if ! type "protoc" > /dev/null; then
    echo "protoc command could not be found"
    exit
fi

if [ ! -f "protoc-gen-doc" ]; then
    echo "protoc-gen-doc does not exist, downloading."
    wget -qO- https://github.com/pseudomuto/protoc-gen-doc/releases/download/v1.5.0/protoc-gen-doc-1.5.0.linux-amd64.go1.16.6.tar.gz | tar -xvz
    mv ./protoc-gen-doc-1.5.0.linux-amd64.go1.16.6/protoc-gen-doc .
    rm -rf ./protoc-gen-doc-1.5.0.linux-amd64.go1.16.6
fi

echo "Compiling protodocs..."
protoc --plugin=protoc-gen-doc=./protoc-gen-doc --doc_out=../protofixtures --doc_opt=json,proto_workspace.json --proto_path=../protobufs ../protobufs/*.proto