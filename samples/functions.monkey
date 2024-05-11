

let ack = fn(m, n) {
    if (m == 0) {
        return n + 1;
    } else {
        if (m > 0) {
           if (n == 0) {
              return ack(m - 1, 1);
           }
           if (n > 0) {
              return ack(m - 1, ack(m, n - 1));
           }
        } else {
            return n + 1;
        }
    }
};

ack(3,5);
