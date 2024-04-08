#include <iostream>
#include <boost/algorithm/string.hpp>
#include <openssl/sha.h>

int main() {
    // Example usage of Boost: to uppercase a string
    std::string exampleString = "Hello, World!";
    boost::to_upper(exampleString);
    std::cout << "Using Boost to uppercase a string: " << exampleString << std::endl;

    // Example usage of OpenSSL: SHA-1 hash of a string
    unsigned char hash[SHA_DIGEST_LENGTH];
    SHA1((unsigned char*)exampleString.c_str(), exampleString.length(), hash);

    // Print the SHA-1 hash
    std::cout << "SHA-1 Hash using OpenSSL: ";
    for(int i = 0; i < SHA_DIGEST_LENGTH; i++)
        printf("%02x", hash[i]);
    std::cout << std::endl;

    return 0;
}
