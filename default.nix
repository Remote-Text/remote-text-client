{ lib, buildNpmPackage, cacert, pkgs }:

buildNpmPackage rec {
  pname = "remote-text-web-client";
  version = "0.1.0";

  src = ./.;

  npmDepsHash = "sha256-sv1hkXLIGJCuPX195OUpFYkaUwNZ66DxnXG3B2qJM0w=";

  buildInputs = [
    cacert
  ];

  env = {
    REMOTE_TEXT_API_URL = "http://localhost:3030/api";
    CYPRESS_INSTALL_BINARY = "0";
  };

  # Credit to <https://github.com/nix-community/templates/blob/main/nextjs/flake.nix#L38-L49>
  postInstall = ''
    mkdir -p ''$out/bin
    exe="''$out/bin/${pname}"
    lib="''$out/lib/node_modules/remote-text"
    cp -r ./.next ''$lib
    touch ''$exe
    chmod +x ''$exe
    echo "
    #!${pkgs.bash}/bin/bash
    cd ''$lib
    ${pkgs.nodePackages_latest.pnpm}/bin/pnpm run start" > ''$exe
  '';

  meta = with lib; {
    description = "The client-side software for Remote Text";
    homepage = "https://github.com/Remote-Text";
    licenses = with licenses; [ ];
    maintainers = with maintainers; [ ];
  };
}
