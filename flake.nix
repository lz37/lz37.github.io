{
  description = "zerozawa's personal blog site";

  inputs = {
    devenv-root = {
      url = "file+file:///dev/null";
      flake = false;
    };
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable-small";
    flake-parts = {
      url = "github:hercules-ci/flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };
    devenv.url = "github:cachix/devenv";
    nix2container = {
      url = "github:nlewo/nix2container";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    mk-shell-bin.url = "github:rrbutani/nix-mk-shell-bin";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs =
    inputs@{ flake-parts, devenv-root, ... }:
    let
      inherit (inputs.nixpkgs) lib;
    in
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        inputs.devenv.flakeModule
      ];
      systems =
        with lib;
        intersectLists (platforms.linux ++ platforms.darwin) (
          intersectLists (platforms.aarch64 ++ platforms.x86_64) systems.flakeExposed
        );
      perSystem =
        {
          config,
          self',
          inputs',
          pkgs,
          system,
          ...
        }:
        {
          devenv.shells.default = {
            name = "blog";
            env = {
              COREPACK_INTEGRITY_KEYS = "0";
            };
            languages = {
              nix = {
                enable = true;
                lsp.enable = true;
              };
              javascript = {
                enable = true;
                package = pkgs.nodejs-slim;
                corepack.enable = true;
              };
            };
          };
        };
    };
}
