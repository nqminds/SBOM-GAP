import { describe, test, expect } from '@jest/globals';
import { validateCPE } from '../src/utils.mjs';
import { cleanCpe } from '../src/get-syft-cpes.mjs';

describe('validateCPE for valid CPEs', () => {
  const validCPEs = [
    'cpe:/a:busybox:busybox:1.33.2',
    'cpe:/a:thekelleys:dnsmasq:2.85',
    'cpe:/a:gnome:glib:2.66.4',
    'cpe:/a:w1.fi:hostapd:2020-06-08-5a8b3662',
    'cpe:/a:haxx:libcurl:7.82.0',
    'cpe:/a:json-c_project:json-c:0.15',
    'cpe:/a:openssl:openssl:1.1.1n',
    'cpe:/a:pcre:pcre:8.44',
    'cpe:/a:kernel:util-linux:2.36.1',
    'cpe:/a:wolfssl:wolfssl:5.2.0',
    'cpe:/a:samba:ppp:2020-10-03-ad3937a0',
    'cpe:/a:gnu:zlib:1.2.11',
    'cpe:/a:thekelleys:dnsmasq:2.86:*:*:*:*:*:*:*',
    'cpe:/a:protobuf-c_project:protobuf-c:1.3.3:*:*:*:*:*:*:*',
    'cpe:/a:sqlite:sqlite:3.5.9:*:*:*:*:*:*:*',
    'cpe:/a:openssl:openssl:3.0.0:alpha1:*:*:*:*:*:*',
    'cpe:/a:kernel:util-linux:2.34',
    'cpe:/a:tcpdump:libpcap:1.5.1:*:*:*:*:*:*:*',
    'cpe:/a:libnl_project:libnl:3.2.7:*:*:*:*:*:*:*',
    'cpe:/a:libnl_project:libnl:3.2.7:*:*:*:*:*:*:*',
    'cpe:/a:libnl_project:libnl:3.4.0:-:*:*:*:*:*:*',
    'cpe:/a:netfilter:libmnl:1.0.3:*:*:*:*:*:*:*',
    'cpe:/a:gnu:glibc:2.34',
  ];

  validCPEs.forEach((cpe) => {
    test(`"${cpe}" should be valid`, async () => {
      const cleandCpe = await cleanCpe(cpe);
      const isValid = await validateCPE(cleandCpe);
      expect(isValid).toBe(true);
    });
  });
});

describe('validateCPE for invalid CPEs', () => {
  const invalidCPEs = [
    'cpe:2.3:a:invalidvendor:invalidproduct:0.0:*:*:*:*:*:*:*',
    'cpe:2.3:a:adduser:adduser:3.134:*:*:*:*:*:*:*',
    'cpe:2.3:a:apt:apt:2.6.1:*:*:*:*:*:*:*',
    'cpe:2.3:a:base-files:base-files:12.4+deb12u5:*:*:*:*:*:*:*',
    'cpe:2.3:a:base-passwd:base-passwd:3.6.1:*:*:*:*:*:*:*',
    'cpe:2.3:a:bash:bash:5.2.15-2+b2:*:*:*:*:*:*:*',
    'cpe:2.3:a:bsdutils:bsdutils:1:2.38.1-5+b1:*:*:*:*:*:*:*',
    'cpe:2.3:a:coreutils:coreutils:9.1-1:*:*:*:*:*:*:*',
    'cpe:2.3:a:dash:dash:0.5.12-2:*:*:*:*:*:*:*',
    'cpe:2.3:a:debconf:debconf:1.5.82:*:*:*:*:*:*:*',
    'cpe:2.3:a:debian-archive-keyring:debian-archive-keyring:2023.3+deb12u1:*:*:*:*:*:*:*',
    'cpe:2.3:a:debianutils:debianutils:5.7-0.5~deb12u1:*:*:*:*:*:*:*',
    'cpe:2.3:a:diffutils:diffutils:1:3.8-4:*:*:*:*:*:*:*',
    'cpe:2.3:a:dirmngr:dirmngr:2.2.40-1.1:*:*:*:*:*:*:*',
    'cpe:2.3:a:dpkg:dpkg:1.21.22:*:*:*:*:*:*:*',
    'cpe:2.3:a:e2fsprogs:e2fsprogs:1.47.0-2:*:*:*:*:*:*:*',
    'cpe:2.3:a:findutils:findutils:4.9.0-4:*:*:*:*:*:*:*',
    'cpe:2.3:a:gcc-12-base:gcc-12-base:12.2.0-14:*:*:*:*:*:*:*',
    'cpe:2.3:a:moby:sys/user:v0.1.0:*:*:*:*:*:*:*',
    'cpe:2.3:a:tianon:gosu:(devel):*:*:*:*:*:*:*',
    'cpe:2.3:a:gnupg-l10n:gnupg-l10n:2.2.40-1.1:*:*:*:*:*:*:*',
    'cpe:2.3:a:gnupg-utils:gnupg-utils:2.2.40-1.1:*:*:*:*:*:*:*',
  ];

  invalidCPEs.forEach((cpe) => {
    test(`"${cpe}" should be invalid`, async () => {
      const cleandCpe = await cleanCpe(cpe);
      const isValid = await validateCPE(cleandCpe);
      expect(isValid).toBe(false);
    });
  });
});
