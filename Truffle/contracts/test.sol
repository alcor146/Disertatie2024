// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract test {
    uint256 constant public PRIME = 2 ** 127 - 1;
    uint8 public minimumShares = 2;
    uint8 public numShares = 4;

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

        require(lenUnique(xS) == file.shareIndices.length, "All share x values must be distinct");

        uint256 recoveredSecret = lagrangeInterpolate(0, xS, yS);

        return recoveredSecret;
}


    function lagrangeInterpolate(uint256 x, uint256[] memory xS, uint256[] memory yS) internal pure returns (uint256) {
    require(xS.length == yS.length, "Mismatched input arrays");
    require(xS.length > 0, "Empty input arrays");

    uint256 result = 0;

    for (uint256 i = 0; i < xS.length; i++) {
        uint256 term = yS[i];
        for (uint256 j = 0; j < xS.length; j++) {
            if (i != j) {
                term = mulmod(term, submod(x, xS[j]), PRIME);
                term = mulmod(term, modInv(submod(xS[i], xS[j]), PRIME), PRIME);
            }
        }
        result = addmod(result, term, PRIME);
    }

    return result;
}

    function recoverSecretWithProvidedShares() public pure returns (uint256) {
        uint256[] memory xS = new uint256[](4);
        xS[0] = 1;
        xS[1] = 2;
        xS[2] = 3;
        xS[3] = 4;

        uint256[] memory yS = new uint256[](4);
        yS[0] = 104461363874047656805117686187024992030;
        yS[1] = 38781544287626081878548068658165878210;
        yS[2] = 143242908161673738683665754845190870117;
        yS[3] = 77563088575252163757096137316331756297;

        uint256 recoveredSecret = lagrangeInterpolate(0, xS, yS);

        return recoveredSecret;
}

    function submod(uint256 a, uint256 b) internal pure returns (uint256) {
        return (a >= b) ? (a - b) : (PRIME - b + a);
    }

    function modInv(uint256 a, uint256 m) internal pure returns (uint256) {
        require(m > 0, "Modulus must be greater than zero");
        require(a > 0 && a < m, "Value 'a' must be greater than zero and less than 'm'");

        int256 m0 = int256(m);
        int256 t;
        int256 q;
        int256 x0 = 0;
        int256 x1 = 1;

        while (a > 1) {
            q = int256(a) / m0;
            t = m0;
            m0 = int256(a) % m0;
            a = uint256(t);

            t = x0;
            x0 = x1 - q * x0;
            x1 = t;
        }

        if (x1 < 0) {
            x1 += int256(m);
        }

        return uint256(x1);
    }


    function lenUnique(uint256[] memory arr) internal pure returns (uint256) {
        uint256 len = arr.length;
        uint256 uniqueCount = len;

        for (uint256 i = 0; i < len; i++) {
            for (uint256 j = i + 1; j < len; j++) {
                if (arr[i] == arr[j]) {
                    uniqueCount--;
                    break;
                }
            }
        }

        return uniqueCount;
    }
}
