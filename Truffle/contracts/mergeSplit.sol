// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract mergeSplit {
    uint256 constant public PRIME = 2 ** 127 - 1;
    uint8 public minimumShares = 2;
    uint8 public numShares = 3;

    struct Share {
        uint256 x;
        uint256 y;
    }

    struct File {
        uint256 secret;
        mapping(uint256 => Share) shares;
        uint256[] shareIndices;
    }

    File[] public files;

    function evalAt(uint256[] memory poly, uint256 x, uint256 prime) internal pure returns (uint256) {
        uint256 accum = 0;
        for (uint256 i = poly.length; i > 0; i--) {
            accum = (accum * x + poly[i - 1]) % prime;
        }
        return accum;
    }

    function makeRandomShares(uint256 secret) public {
        uint256[] memory poly = new uint256[](minimumShares);
        poly[0] = secret;

        for (uint8 i = 1; i < minimumShares; i++) {
            poly[i] = uint256(keccak256(abi.encodePacked(secret, i))) % PRIME;
        }

        File storage newFile = files.push();
        newFile.secret = secret;

        for (uint8 i = 1; i <= numShares; i++) {
            uint256 x = i;
            uint256 y = evalAt(poly, x, PRIME);
            newFile.shares[i] = Share(x, y);
            newFile.shareIndices.push(i);
        }
        
    }

    function lagrangeInterpolate(uint256 x, uint256[] memory xS, uint256[] memory yS) internal pure returns (uint256) {
        uint256 k = xS.length;
        require(k == yS.length, "Mismatched input arrays");
        uint256 accum = 0;
        for (uint256 i = 0; i < k; i++) {
            uint256 num = 1;
            uint256 den = 1;
            for (uint256 j = 0; j < k; j++) {
                if (i != j) {
                    num = (num * (x - xS[j])) % PRIME;
                    den = (den * (xS[i] - xS[j])) % PRIME;
                }
            }
            uint256 lagrangeCoeff = (num * yS[i] * modInv(den, PRIME)) % PRIME;
            accum = (accum + lagrangeCoeff) % PRIME;
        }
        return accum;
    }

    function recoverSecret(uint256 fileIndex) public view returns (uint256) {
        require(fileIndex < files.length, "Invalid file index");

        File storage file = files[fileIndex];
        uint256[] memory xS = new uint256[](file.shareIndices.length);
        uint256[] memory yS = new uint256[](file.shareIndices.length);

        for (uint256 i = 0; i < file.shareIndices.length; i++) {
            uint256 x = file.shareIndices[i];
            xS[i] = x;
            yS[i] = file.shares[x].y;
        }

        uint256[] memory interpolatedValues = new uint256[](file.shareIndices.length);

        for (uint256 i = 0; i < file.shareIndices.length; i++) {
            uint256 x = file.shareIndices[i];
            interpolatedValues[i] = lagrangeInterpolate(x, xS, yS);
        }

        uint256 recoveredSecret = interpolatedValues[0];
        for (uint256 i = 1; i < file.shareIndices.length; i++) {
            require(xS[i] != xS[i - 1], "Share x values must be distinct");
            recoveredSecret = (recoveredSecret * interpolatedValues[i]) % PRIME;
        }

        return recoveredSecret;
    }

    function modInv(uint256 a, uint256 m) internal pure returns (uint256) {
        int256 t;
        int256 newT = 1;
        int256 r = int256(a);
        int256 newR = int256(m);

        while (newR != 0) {
            int256 quotient = r / newR;
            (t, newT) = (newT, t - quotient * newT);
            (r, newR) = (newR, r - quotient * newR);
        }

        if (r > 1) return 0; // No modular inverse exists
        if (t < 0) t += int256(m);

        return uint256(t);
    }
}
