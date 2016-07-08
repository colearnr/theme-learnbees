# CoLearnr kids theme (Learnbees)

This theme is used by the [CoLearnr community edition](https://github.com/colearnr/colearnr)

## Static directories

- font
- images
- sounds
- stylesheets (Combination of sass and css)

## Building

You need rubygems and compass installed in order to compile sass files into css.

### Ubuntu/debian
```bash
sudo apt install -y ruby ruby-compass
```

### Centos 7
```bash
yum install -y ruby rubygems

if hash sass 2>/dev/null; then
    echo "Compass is already installed."
else
    gem update
    gem update --system
    gem uninstall psych -v 2.0.17
    gem install compass
    gem install psych
fi
```
