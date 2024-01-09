{
  description = "The server-side software for Remote Text";

  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs";
    flockenzeit.url = "github:balsoft/Flockenzeit";
  };

  outputs = { self, flockenzeit, nixpkgs, ... }:
    let
      forAllSystems = gen:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed
        (system: gen nixpkgs.legacyPackages.${system});
    in {
      packages = forAllSystems (pkgs: rec {
        remote-text-web-client = pkgs.callPackage ./. { };
        default = remote-text-web-client;
        remote-text-web-client-for-docker = pkgs.callPackage ./. { apiURL = "http://remote-text-server/api"; };
        dockerImage = pkgs.dockerTools.buildImage {
          name = "remote-text-web-client";
          created = flockenzeit.lib.ISO-8601 self.lastModified;
          config = {
            Cmd = [ "${remote-text-web-client-for-docker}/bin/remote-text-web-client" ];
          };
        };
      });
    };
}
