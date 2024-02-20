package ucm.iptracker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ucm.iptracker.model.ApplicationInfo;
import ucm.iptracker.repository.ApplicationInfoRepo;


@RestController
public class Test {
	private final ApplicationInfoRepo appInfoRepo;


	@Autowired
	public Test(ApplicationInfoRepo appInfoRepo) {
		this.appInfoRepo = appInfoRepo;
	}

	@GetMapping("/test")
	public String test() {
		ApplicationInfo a = new ApplicationInfo();
		a.setDescription("abc");

		appInfoRepo.save(a);
		return "Hello World!";
	}
}
