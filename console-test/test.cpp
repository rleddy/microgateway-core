

#include <iostream>

using namespace std;


int main(int argc, char **argv) {
    
    cout << "This is a test" << endl;
    
    unsigned long int N = 11000000L; // UINT_MAX;
    time_t start = clock();
    
    for ( unsigned long int i = 0; i < N; i++ ) {
        
    }
    
    time_t stop = clock();
    //
    cout << "N = " << N << endl;
    cout << double(stop - start)/1000000.0 << endl;
    exit(0);
}
