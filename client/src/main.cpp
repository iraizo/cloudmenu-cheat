#include <iostream>
#include <string>
#include "httplib.h"
#include <Windows.h>


int main() {
	httplib::Client cli("http://localhost:3002");
	std::string token;

	std::cout << "enter token: ";
	std::cin >> token;

	httplib::Headers headers = { {
			"authorization", token
	} };

	if (auto res = cli.Get("/api/menu/getInfo", headers)) {

		std::cout << res->body << std::endl;
		/* 
			Parse the JSON here to enable ESP etc.
		*/
	}
	else {
		auto err = res.error();
		std::cout << "error: " << err << std::endl;
	}

}