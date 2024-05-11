let hanoi = fn(n, from_rod, to_rod, aux_rod) {
    if (n == 1) {
        puts("Move disk 1 from rod " + from_rod + " to rod " + to_rod);
    } else {
      hanoi(n-1, from_rod, aux_rod, to_rod);
      puts("Move disk " + str(n) + " from rod " + from_rod + " to rod " + to_rod);
      hanoi(n-1, aux_rod, to_rod, from_rod);
    }
};

hanoi(6, "A", "B", "C");
puts("DONE");
