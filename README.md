# Publii Plugin Front Slider
A plugin to generate a slider in **homepage** or **blog index page** with numerous options.

<p><img height="100" style="height:100px;" alt="publii plugin" title="Plugin icons" src="https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Front-Slider/24497542212de6d654b98e36bbc65b7d541023c6/.assets/thumbnail.svg"></p>

## Features
This plugin creates an image slider on the website's homepage or blog index page. 

![Slider in home](https://github.com/gpsblues/Publii-Plugin-Front-Slider/blob/main/.assets/screen.gif)*Home page slider with three image and static test in Simple3 theme.*

The slider and each individual slide are highly customizable with texts, links, colors, arrows, and navigation buttons.

![Publii plugin screenshot](https://raw.githubusercontent.com/gpsblues/Publii-Plugin-Front-Slider/refs/heads/main/.assets/screen.png)

The slider in this plugin is a Publii adaptation of the [VanillaSlider](https://github.com/rchisholm/vanilla-slider) by Rusty Chisholm. The original repository offers detailed descriptions of most of the [plugin's options](https://github.com/rchisholm/vanilla-slider?tab=readme-ov-file#options) and showcases several demos.

If you use this plugin, consider giving it a ⭐ on GitHub: it's the only way for me to know if this work is appreciated. Thank you!

## Installation and Usage
- Download the .zip file of the latest plugin version from the [release page](https://github.com/gpsblues/Publii-Plugin-Front-Slider/releases/).
- Open Publii CMS and [install the plugin](https://getpublii.com/docs/plugins.html#installingplugins).
- [Enable the plugin](https://getpublii.com/docs/plugins.html#enablingplugins).
- Set plugin options by clicking on its name.
- Save and Preview/Sync your website to see it in action.

## How it works
The plugin works exclusively on the home or posts page by inserting a small HTML snippet, which is then processed by JavaScript based on user settings:  

```html
<section class="home-slider">
    <div id="slider-01"></div>
</section>
```  

From the **Advanced** section, the snippet can be inserted in two ways:  

1. **Automatically after the `<main>` tag**  
   This is the default option, which doesn’t require modifying the `.hbs` file. However, you must ensure that the `<main>` tag exists in the theme.  

2. **In `[PLUGIN-SLIDER]` custom position**  
   With this option, you need to manually edit the `.hbs` file by adding the `[PLUGIN-SLIDER]` placeholder where you want the slider to appear.  

Since themes can vary greatly from one another, in both cases, manual adjustments to the CSS styles may be necessary.

## Options
Here, you'll find a brief description of the various options. For more details, you can refer to the [VanillaSlider page](https://github.com/rchisholm/vanilla-slider?tab=readme-ov-file#options).

### Setup
#### Destination
- **FrontPage**: insert the slider on the home page.
- **PostsPage**: insert the slider on the blog index if enabled (Publii 0.46.2 or more).

#### Slider Height  
Defaults `100vh`.
You can also use fixed values in px or include theme variables (make sure these variables exist). Examples of possible values: 
- `600px`
- `10rem`
- `100vh - var(--navbar-height)`
- `100vh - var(--header-height)`

What you type in this field will be enclosed within the CSS `calc()` function.

### Upload Images 
#### Add Image
A repeater control allows you to add as many images as you like. For each image, you can specify custom text, destination links, and SEO options.  

### Static Text  
Static text is an overlay displayed on the slider. Its presence overrides the text of individual images. Leave these fields empty if you prefer unique text for each image.  

### Slider Options  
This section lets you customize various visual and functional aspects of the slider, including colors, buttons, autoplay, fade effects, [and more](https://github.com/rchisholm/vanilla-slider?tab=readme-ov-file#options).  

### Advanced  
#### Slider position
- Below the **`<main>`** tag
- In placeholder **`[PLUGIN-SLIDER]`**

The second option involves modifying the `.hbs` files of the theme.

#### Custom CSS
Here you can define custom CSS styles that won't affect other pages of the theme. You can also hide entire sections of the page, for example: `.hero { display: none; }`.
Let your creativity flow! 

## Disclaimer
This plugin is an unofficial extension for the [Publii CMS](https://getpublii.com/). I do not assume any responsibility for potential issues or malfunctions that may occur while using this plugin. Additionally, support for this plugin is not guaranteed.

For official Publii resources, please visit the [Publii CMS Official Repository](https://marketplace.getpublii.com/plugins/).

## Credits
[VanillaSlider](https://github.com/rchisholm/vanilla-slider) by Rusty Chisholm.
