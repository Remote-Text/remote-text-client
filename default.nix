{ lib, buildNpmPackage, cacert, pkgs, apiURL ? "http://localhost:3030/api" }:

buildNpmPackage rec {
  pname = "remote-text-web-client";
  version = "0.1.0";

  src = ./.;

  npmDepsHash = "sha256-sv1hkXLIGJCuPX195OUpFYkaUwNZ66DxnXG3B2qJM0w=";

  buildInputs = [
    cacert
  ];

  env = {
    REMOTE_TEXT_API_URL = apiURL;
    CYPRESS_INSTALL_BINARY = "0";
  };

  # Credit to <https://github.com/nix-community/templates/blob/main/nextjs/flake.nix#L38-L49>
  postInstall = ''
    mkdir -p $out/bin
    exe="$out/bin/${pname}"
    rm -rf $out/lib/node_modules
    lib="$out/lib/standalone"
    cp -r ./.next/standalone $lib
    cp -r public $lib
    cp -r ./.next/static $lib/.next
    touch $exe
    chmod +x ''$exe
    echo "#!${pkgs.bash}/bin/bash
    cd $lib
    ${pkgs.nodejs}/bin/node server.js" > $exe
  '';

  meta = with lib; {
    description = "The client-side software for Remote Text";
    homepage = "https://github.com/Remote-Text";
    licenses = with licenses; [ ];
    maintainers = with maintainers; [ ];
  };
}
