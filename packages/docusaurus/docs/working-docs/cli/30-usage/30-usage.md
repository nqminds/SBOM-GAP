---
title: CLI Tool Usage
---

# Commands and Options:

To generate a Software Bill Of Materials (SBOM) for the ecosystems bellow use the command (Uses [syft](https://github.com/anchore/syft) and [grype](https://github.com/anchore/grype)):

Alpine (apk)
C (conan)
C++ (conan)
Dart (pubs)
Debian (dpkg)
Dotnet (deps.json)
Objective-C (cocoapods)
Elixir (mix)
Erlang (rebar3)
Go (go.mod, Go binaries)
Haskell (cabal, stack)
Java (jar, ear, war, par, sar, nar, native-image)
JavaScript (npm, yarn)
Jenkins Plugins (jpi, hpi)
Linux kernel archives (vmlinz)
Linux kernel modules (ko)
Nix (outputs in /nix/store)
PHP (composer)
Python (wheel, egg, poetry, requirements.txt)
Red Hat (rpm)
Ruby (gem)
Rust (cargo.lock)
Swift (cocoapods, swift-package-manager)

```sh
nqmvul -generateSbom <project_path> <project_name>
```

```sh 
nqmvul -generateSbom Repositories/cyber cyber_sbom
Running syft to generate SBOM...
SBOM generation completed. SBOM saved to /vulnerability-reports/sboms/cyber_sbom.json
Running grype to generate vulnerability report...
NAME              INSTALLED  FIXED-IN  TYPE   VULNERABILITY        SEVERITY 
@babel/traverse   7.14.2     7.23.2    npm    GHSA-67hx-6x53-jw92  Critical  
ansi-regex        3.0.0      3.0.1     npm    GHSA-93q8-gq69-wqmw  High      
ansi-regex        5.0.0      5.0.1     npm    GHSA-93q8-gq69-wqmw  High      
es5-ext           0.10.62    0.10.63   npm    GHSA-4gmj-3p3h-gm8h  Low       
express           4.18.2     4.19.2    npm    GHSA-rv95-896h-c2vc  Medium    
file-type         14.7.1     16.5.4    npm    GHSA-mhxj-85r3-2x55  High      
follow-redirects  1.15.3     1.15.4    npm    GHSA-jchw-25xp-jwwc  Medium    
follow-redirects  1.15.3     1.15.6    npm    GHSA-cxjh-pqwp-8mfp  Medium    
get-func-name     2.0.0      2.0.1     npm    GHSA-4q6p-r6v2-jvc5  High      
ip                2.0.0      2.0.1     npm    GHSA-78xj-cgh5-2h22  Medium    
json5             1.0.1      1.0.2     npm    GHSA-9c47-m6qq-7p4h  High      
json5             2.2.0      2.2.2     npm    GHSA-9c47-m6qq-7p4h  High      
minimatch         3.0.4      3.0.5     npm    GHSA-f8q6-p94x-37v3  High      
minimist          1.2.5      1.2.6     npm    GHSA-xvch-5gv4-984h  Critical  
nanoid            3.1.20     3.1.31    npm    GHSA-qrpm-p2h7-hrv2  Medium    
openssl           3                    conan  CVE-2023-5363        High      
openssl           3                    conan  CVE-2023-0401        High      
openssl           3                    conan  CVE-2023-0217        High      
openssl           3                    conan  CVE-2023-0216        High      
openssl           3                    conan  CVE-2022-3996        High      
openssl           3                    conan  CVE-2022-3786        High      
openssl           3                    conan  CVE-2022-3602        High      
openssl           3                    conan  CVE-2022-3358        High      
openssl           3                    conan  CVE-2022-1473        High      
openssl           3                    conan  CVE-2021-4044        High      
openssl           3                    conan  CVE-2023-6129        Medium    
openssl           3                    conan  CVE-2023-3446        Medium    
openssl           3                    conan  CVE-2023-2975        Medium    
openssl           3                    conan  CVE-2023-1255        Medium    
openssl           3                    conan  CVE-2022-4203        Medium    
openssl           3                    conan  CVE-2022-1434        Medium    
openssl           3                    conan  CVE-2022-1343        Medium    
path-parse        1.0.6      1.0.7     npm    GHSA-hj48-42vr-x3v9  Medium    
semver            5.7.1      5.7.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            6.3.0      6.3.1     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.0.0      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.3.2      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
semver            7.3.5      7.5.2     npm    GHSA-c2qf-rxjj-qqgw  Medium    
terser            5.7.0      5.14.2    npm    GHSA-4wf5-vphf-c2xc  High      
trim              0.0.1      0.0.3     npm    GHSA-w5p7-h5w8-2hfq  High      
trim-newlines     3.0.0      3.0.1     npm    GHSA-7p7h-4mm5-852v  High      
word-wrap         1.2.3      1.2.4     npm    GHSA-j8xg-fqg3-53r7  Medium

Vulnerability report saved to: /vulnerability-reports/reports/vulnerability_report_cyber_sbom
```
To generate a Software Bill Of Materials (SBOM) for other C/C++ ecosystems (Uses ccscanner and [grype](https://github.com/anchore/grype)).
Package Managers:
Deb
Conan
Vcpkg
Clib
CPM
Buckaroo
Dds
Hunter
Cppget
Xrepo
Gitsubmodule
Pkg-config

```sh
nqmvul -generateCCPPReport <path_to_c/cpp_project> <project_name>
```

Available commands
```sh
nqmvul -help
```
```sh
nqmvul -help


    Usage:
    nqmvul [argument] [filePath]
    nqmvul [argument] [text]
    nqmvul [argument] [filePath] [text]
    nqmvul [argument] [filePath] [filePath] [text] [filePath]
    nqmvul [argument] [text] [text]
    nqmvul [argument] [text] [argument]

    Arguments:
    -getCpes                Path to SBOM.json file
    -listCpeDetails         Path to SBOM.json file
    -getCves                CPE2.3 format e.g. "cpe:2.3:a:busybox:busybox:1.33.2"
    -writeCves              Path to SBOM.json file, absolute path to required output directory
    -getHistoricalCpes      CPE2.3 format e.g. "cpe:2.3:a:busybox:busybox:1.33.2"
    -getHistoricalCves      Supported CVE format: "CVE-2022-48174"
    -getCweInfo             CWE. If multiple CWEs, separate by commas without white space. e.g. 'CWE-476,CWE-681'
    -listVulnerabilities    Absolute path to grype vulnerability report file
    -generateSbom           Absolute path to project and a project name
    -generateConan          Project Name. Please ensure the dependencies exist for /vulnerability-reports/ccsDependencies/<project_name>_dependencies
    -genDependencies        Absolute path to cppDierectory and projectName
    -mapCpes                Project Name. Please ensure that vulnerability-reports/conan-files/<project_name>/conanfile.txt exists
    -generateCSbom          Project Name, SBOM format (json or xml)
    -getGhsa                GHSA code. e.g GHSA-j8xg-fqg3-53r7
    -extractGhsas           Absolute path to grype vulnerability report file
    -classifyCwe            CWE Id, e.g. CWE-354
    -getHistory             CPE e.g. cpe:2.3:a:busybox:busybox:1.33.2
    -generateCCPPReport     Absolute path to project and a project name```



The -getCpes flag will parse an SBOM and return a list of CPEs in the 2.3 format.
```sh
nqmvul -getCpes <path_to_sbom.json>
```

```sh

```