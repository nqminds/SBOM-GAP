---
title: CLI Tool Usage
---

# Commands and Options:

Available commands:

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
    -generateCCPPReport     Absolute path to project and a project name
```


To generate a Software Bill Of Materials (SBOM) for the ecosystems bellow use the command `nqmvul -generateSbom <project_path> <project_name>` (Uses [syft](https://github.com/anchore/syft) and [grype](https://github.com/anchore/grype)):

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

Use the  `-generateCCPPReport` to generate a Software Bill Of Materials (SBOM) for other C/C++ ecosystems (Uses ccscanner and [grype](https://github.com/anchore/grype)).
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

```sh
nqmvul  -generateCCPPReport absolute/path/to/qtbase qtbase_report
Starting full report generation for project /qtbase...
Trying to generate dependency list for qtbase_report
dependency scanning completed.
dependency list saved to /sbom-cli/vulnerability-reports/ccsDependencies/qtbase_report_dependencies
Dependency list completed completed.
Writing conan file for ../vulnerability-reports/ccsDependencies/qtbase_report_dependencies...
Conan file generation completed.
Mapping CPEs, please wait...
CPE mapping completed. Check vulnerability-reports/cpes/cpeMapping.json for the mapping.
Generating SBOM in qtbase_report format...
SBOM generation completed. Check vulnerability-reports/sboms/qtbase_report_sbom.json for the SBOM.
Full report generation for project qtbase_report completed successfully.
/sbom-cli/vulnerability-reports/sboms/qtbase_report_sbom.json
Generating Vulnerability report for qtbase_report_sbom.json
Running grype to generate vulnerability report...
NAME         INSTALLED     FIXED-IN  TYPE            VULNERABILITY   SEVERITY 
addressbook  6.x-3.4                 UnknownPackage  CVE-2012-2307   Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2023-30678  Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2022-39915  Medium    
calendar     12.2.11.3000            UnknownPackage  CVE-2023-21464  Low       
calendar     12.2.11.3000            UnknownPackage  CVE-2022-33705  Low       
chat         2021-04-09              UnknownPackage  CVE-2021-30480  High      
db2          11.5.9                  UnknownPackage  CVE-2023-47701  High      
db2          11.5.9                  UnknownPackage  CVE-2023-40687  High      
db2          11.5.9                  UnknownPackage  CVE-2023-38727  High      
db2          11.5.9                  UnknownPackage  CVE-2023-29258  High      
db2          11.5.9                  UnknownPackage  CVE-2012-3324   High      
db2          11.5.9                  UnknownPackage  CVE-2023-47747  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-47746  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-47158  Medium    
db2          11.5.9                  UnknownPackage  CVE-2023-27859  Medium    
directfb     1.4.13                  UnknownPackage  CVE-2014-2977   High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32643  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32636  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-29499  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-27219  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-27218  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2020-35457  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2019-13012  High      
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32665  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2023-32611  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-3800   Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2021-28153  Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2012-0039   Medium    
glib:2.0     2.0.7                   UnknownPackage  CVE-2008-4316   Medium    
gui          7.70                    UnknownPackage  CVE-2015-2282   High      
gui          7.70                    UnknownPackage  CVE-2022-41205  Medium    
gui          7.70                    UnknownPackage  CVE-2015-2278   Medium    
harfbuzz     6.0.0                   UnknownPackage  CVE-2023-25193  High      
jpeg         2022-06-15              UnknownPackage  CVE-2022-37768  High      
jpeg         2022-06-15              UnknownPackage  CVE-2022-37770  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2022-37769  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2022-35166  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39520  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39519  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39518  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39517  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39516  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39515  Medium    
jpeg         2022-06-15              UnknownPackage  CVE-2021-39514  Medium    
libinput     1.20.0                  UnknownPackage  CVE-2022-1215   High      
libproxy     0.4.15                  UnknownPackage  CVE-2020-26154  Critical  
libproxy     0.4.15                  UnknownPackage  CVE-2020-25219  High      
mysql        8.1.0                   UnknownPackage  CVE-2024-20985  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20984  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20982  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20981  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20977  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20975  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20973  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20971  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20970  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20969  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20968  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20967  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20966  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20965  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20964  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20963  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20962  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20961  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2024-20960  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22114  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22103  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22097  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22095  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22084  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22078  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22070  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22068  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22066  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22059  Medium    
mysql        8.1.0                   UnknownPackage  CVE-2023-22032  Medium    
odbc         18.0                    UnknownPackage  CVE-2023-28304  High      
odbc         18.0                    UnknownPackage  CVE-2023-23375  High      
openssl      3.2.0                   UnknownPackage  CVE-2024-0727   Medium    
openssl      3.2.0                   UnknownPackage  CVE-2023-6129   Medium    
oracle       121030                  UnknownPackage  CVE-2015-0489   Low       
pcre2        10.40                   UnknownPackage  CVE-2022-41409  High      
project      2016                    UnknownPackage  CVE-2020-0760   High      
project      2016                    UnknownPackage  CVE-2019-1264   High      
project      2016                    UnknownPackage  CVE-2018-8575   High      
project      2016                    UnknownPackage  CVE-2015-2503   High      
project      2016                    UnknownPackage  CVE-2020-1322   Medium    
textedit     -                       UnknownPackage  CVE-2005-4504   High      
tools        12.3.5                  UnknownPackage  CVE-2014-4200   Medium    
tools        12.3.5                  UnknownPackage  CVE-2014-4199   Medium    
widgets      4.0.5                   UnknownPackage  CVE-2007-4034   High      
x11          6.9                     UnknownPackage  CVE-2013-7439   High

Vulnerability report saved to: /sbom-cli/vulnerability-reports/reports/vulnerability_report_qtbase_report

```




The `-getCpes` flag will parse an SBOM and return a list of CPEs in the 2.3 format.


```sh
nqmvul -getCpes /sbom-cli/vulnerability-reports/sboms/cyber_sbom.json
[
  'cpe:2.3:a:@aashutoshrathi/word-wrap:@aashutoshrathi/word-wrap:1.2.6:*:*:*:*:*:*:*',
  'cpe:2.3:a:@ampproject/remapping:@ampproject/remapping:2.2.1:*:*:*:*:*:*:*',
  'cpe:2.3:a:@apidevtools/json-schema-ref-parser:@apidevtools/json-schema-ref-parser:9.0.9:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.12.11:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.12.13:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/code-frame:@babel/code-frame:7.23.4:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/compat-data:@babel/compat-data:7.14.0:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/compat-data:@babel/compat-data:7.23.3:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/core:@babel/core:7.14.3:*:*:*:*:*:*:*',
  'cpe:2.3:a:@babel/core:@babel/core:7.23.3:*:*:*:*:*:*:*',
]
```
The `-listCpeDetails` flag will parse an SBOM and return detailed information about each CPE, such as CVEs and CWEs

```sh
nqmvul -listCpeDetails /sbom-cli/vulnerability-reports/sbom.json 
Fetching cpe info from API ... 
{
  'cpe:2.3:a:busybox:busybox:1.33.2': [
    {
      id: 'CVE-2021-42376',
      description: "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
      weakness: [Array],
      baseScore: 5.5,
      baseSeverity: 'MEDIUM'
    }, ...],
 'cpe:2.3:a:thekelleys:dnsmasq:2.85': [
    {
      id: 'CVE-2022-0934',
      description: 'A single-byte, non-arbitrary write/use-after-free flaw was found in dnsmasq. This flaw allows an attacker who sends a crafted packet processed by dnsmasq, potentially causing a denial of service.',
      weakness: [Array],
      baseScore: 7.5,
      baseSeverity: 'HIGH'
    }, ...],
    
    ...
}

```

If the `-getCves` flag is set, all CVEs that are available for a CPE will be retrieved along with any related CWEs.

```sh
nqmvul -getCves cpe:2.3:a:busybox:busybox:1.33.2 
Fetching CVEs from API for:  cpe:2.3:a:busybox:busybox:1.33.2
[
  {
    id: 'CVE-2021-42376',
    description: "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
    weakness: [ 'CWE-476', 'CWE-476' ],
    baseScore: 5.5,
    baseSeverity: 'MEDIUM'
  },
  {
    id: 'CVE-2022-28391',
    description: "BusyBox through 1.35.0 allows remote attackers to execute arbitrary code if netstat is used to print a DNS PTR record's value to a VT compatible terminal. Alternatively, the attacker could choose to change the terminal's colors.",
    weakness: [ 'NVD-CWE-noinfo' ],
    baseScore: 8.8,
    baseSeverity: 'HIGH'
  },
  {
    id: 'CVE-2022-48174',
    description: 'There is a stack overflow vulnerability in ash.c:6030 in busybox before 1.35. In the environment of Internet of Vehicles, this vulnerability can be executed from command to arbitrary code execution.',
    weakness: [ 'CWE-787' ],
    baseScore: 9.8,
    baseSeverity: 'CRITICAL'
  },
  ...
]

```

The `-writeCVEs` flag will write all the CVE data of an sbom into a json format to output_directory/cveData.json

```sh
nqmvul -writeCves /vulnerability-reports/sbom.json /Desktop 
Writing CVE data to cveData.json
Writing file completed


cat Desktop/cveData.json 
{
  "cpe:2.3:a:busybox:busybox:1.33.2": [
    {
      "id": "CVE-2021-42376",
      "description": "A NULL pointer dereference in Busybox's hush applet leads to denial of service when processing a crafted shell command, due to missing validation after a \\x03 delimiter character. This may be used for DoS under very rare conditions of filtered command input.",
      "weakness": [
        "CWE-476",
        "CWE-476"
      ],
      "baseScore": 5.5,
      "baseSeverity": "MEDIUM"
    },
    {
      "id": "CVE-2022-28391",
      "description": "BusyBox through 1.35.0 allows remote attackers to execute arbitrary code if netstat is used to print a DNS PTR record's value to a VT compatible terminal. Alternatively, the attacker could choose to change the terminal's colors.",
      "weakness": [
        "NVD-CWE-noinfo"
      ],
      "baseScore": 8.8,
      "baseSeverity": "HIGH"
    },
    {
      "id": "CVE-2022-48174",
      "description": "There is a stack overflow vulnerability in ash.c:6030 in busybox before 1.35. In the environment of Internet of Vehicles, this vulnerability can be executed from command to arbitrary code execution.",
      "weakness": [
        "CWE-787"
      ],
      "baseScore": 9.8,
      "baseSeverity": "CRITICAL"
    }, ...
}
```

The `-getHistoricalCpes` flag will return all known versions of the input CPE. The CPE must be in CPE2.3 format e.g. cpe:2.3:\a:\busybox:busybox:1.33.2


```sh
nqmvul -getHistoricalCpes cpe:2.3:\a:\busybox:busybox:1.33.2 
Fetching historical CPEs from API
[
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.1.1:*:*:*:*:*:*:*',
    title: 'BusyBox 1.1.1',
    lastModified: '2012-07-25T15:25:49.167',
    created: '2007-08-23T21:16:59.567',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.2:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.2',
    lastModified: '2012-07-25T15:25:52.650',
    created: '2012-07-03T17:11:16.413',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.1:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.1',
    lastModified: '2012-07-25T15:25:52.587',
    created: '2012-07-03T17:11:16.507',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.20.0:*:*:*:*:*:*:*',
    title: 'BusyBox 1.20.0',
    lastModified: '2012-07-25T15:25:52.540',
    created: '2012-07-03T17:11:16.600',
    deprecated: false
  },
  {
    cpeName: 'cpe:2.3:a:busybox:busybox:1.19.4:*:*:*:*:*:*:*',
    title: 'BusyBox 1.19.4',
    lastModified: '2012-07-25T15:25:52.227',
    created: '2012-07-03T17:11:16.710',
    deprecated: false
  }, ... 63 more items
```

The `-getHistoricalCves` flag will return all known versions of the input CVE. Supported CVE format: "CVE-2021-42376"

```sh
 nqmvul -getHistoricalCves CVE-2021-42376 
Fetching historical CVEs from API
[
  {
    cveId: 'CVE-2021-42376',
    cveChangeId: '6E91C58C-F0AA-4874-8946-FE2C2DA4175A',
    created: '2021-11-17T19:44:19.073',
    mewCWEId: [ 'NIST CWE-476' ],
    oldCWEId: []
  },
  {
    cveId: 'CVE-2021-42376',
    cveChangeId: '4160FCB4-8DF4-48A8-9981-C05EBE6C1C91',
    created: '2021-11-19T16:51:46.827',
    mewCWEId: [],
    oldCWEId: []
  },
  {
    cveId: 'CVE-2021-42376',
    cveChangeId: '9333A583-855D-46EE-8D8A-65222D3B04D4',
    created: '2021-11-25T03:15:07.063',
    mewCWEId: [],
    oldCWEId: []
  },
     ...
]

```







































