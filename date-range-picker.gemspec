$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "date-range-picker/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "date-range-picker"
  s.version     = DateRangePicker::VERSION
  s.authors     = ["ni"]
  s.email       = ["i@ni.com"]
  s.homepage    = "ni.com"
  s.summary     = "DateRangePicker."
  s.description = "DateRangePicker."

  s.files = Dir["{app,config,db,lib}/**/*"] + ["MIT-LICENSE", "Rakefile", "README.rdoc"]
  s.test_files = Dir["test/**/*"]

  #s.add_dependency "rails", "~> 3.2.7"

  s.add_development_dependency "sqlite3"
end
