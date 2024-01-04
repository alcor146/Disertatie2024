// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract ShamirSecretSharing {
    uint256 constant public PRIME = 2**256 - 189; // A large prime number

    constructor() {
        // Constructor with no parameters
    }

    function splitSecret(uint256 secret, uint8 THRESHOLD, uint8 TOTAL_SHARES) public pure returns (uint256[] memory) {
    require(secret < PRIME, "Secret exceeds prime modulus");

    uint256[] memory shares = new uint256[](TOTAL_SHARES);
    uint256[] memory coef = new uint256[](THRESHOLD);

    coef[0] = secret;

    for (uint8 i = 1; i < THRESHOLD; i++) {
        coef[i] = uint256(keccak256(abi.encodePacked(secret, i))) % PRIME;
    }

    for (uint8 i = 0; i < TOTAL_SHARES; i++) {
        uint256 x = uint256(i + 1);

        shares[i] = 0;
        for (uint8 j = 0; j < THRESHOLD; j++) {
            shares[i] = (shares[i] + coef[j] * (x ** j)) % PRIME;
        }
    }

    return shares;
}


    function combineShares(uint256[] memory shares, uint8 THRESHOLD) public pure returns (uint256) {
        require(shares.length >= THRESHOLD, "Not enough shares provided");

        uint256 secret = 0;

        for (uint8 i = 0; i < THRESHOLD; i++) {
            uint256 xi = shares[i];
            uint256 num = 1;
            uint256 den = 1;

            for (uint8 j = 0; j < THRESHOLD; j++) {
                if (i != j) {
                    uint256 xj = shares[j];
                    num = (num * PRIME + xj) % PRIME;
                    den = (den * (xi + PRIME - xj)) % PRIME;
                }
            }

            secret = (secret + num * modInverse(den, PRIME)) % PRIME;
        }

        return secret;
    }

    function modInverse(uint256 a, uint256 m) internal pure returns (uint256) {
        require(m > 0, "Modulus must be positive");
        require(a > 0 && a < m, "Invalid input");

        int256 t1;
        int256 t2;
        int256 t3;

        int256 m0 = int256(m);
        int256 a0 = int256(a);

        t1 = 0;
        t2 = 1;
        t3 = m0;

        while (a0 > 1) {
            int256 quotient = a0 / m0;

            (a0, m0) = (m0, a0 - quotient * m0);
            (t1, t2) = (t2, t1 - quotient * t2);
        }

        if (t2 < 0) {
            t2 += int256(m);
        }

        return uint256(t2);
    }
}
