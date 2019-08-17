

#include <iostream>

using namespace std;


int main(int argc, char **argv) {

	cout << "this is a test" << endl;
	
	clock_t start = clock();
	unsigned long int N = 11000000L; //  UINT_MAX;
	for ( unsigned long int i = 0; i < N; i++ ) {
		// do nothing
	}
	
	clock_t stop = clock();
	
	cout << "N = " << N << endl;
	cout << (double(stop - start)*1.0/1000000.0) << endl;

}
