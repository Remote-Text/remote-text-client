{
  description = "The server-side software for Remote Text";

  outputs = { self, nixpkgs, ... }:
    let
      forAllSystems = gen:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed
        (system: gen nixpkgs.legacyPackages.${system});
    in {
      packages = forAllSystems (pkgs: rec {
        remote-text-web-client = pkgs.callPackage ./. { };
        default = remote-text-web-client;
        dockerImage = pkgs.dockerTools.buildImage {
          name = "remote-text-web-client";
          # Based on the last commit date, see: https://nixos.wiki/wiki/Docker#Reproducible_image_dates
          created = builtins.substring 0 8 self.lastModifiedDate;
          config = {
            Cmd = [ "${remote-text-web-client}/bin/remote-text-web-client" ];
          };
        };
      });
    };
}
