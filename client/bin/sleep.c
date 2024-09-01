#include <stdio.h>
#include <unistd.h>

// gcc sleep.c -o sleep

int main() {
    sleep(2);
    printf("foo\n");
    return 0;
}
