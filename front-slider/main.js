// https://github.com/GetPublii/Publii/discussions/1359
// https://github.com/rchisholm/vanilla-slider

class VanillaSlider {
    constructor (API, name, config) {
        this.API = API; 		// gives you an access to the plugins API functions
		this.name = name; 		// retrieved plugin name - probably will be removed in the future
		this.config = config; 	// gives access to the plugin saved config
    }	

	// Modifiers - use them if you need to modify existing output e.g. to filter titles.
    addModifiers () {
		this.API.addModifier('htmlOutput', this.modifyHTML, 1, this);    
    }

	// Insertions - should be used to input your own HTML/CSS/JS code in specific places of the website.
	addInsertions () {
		this.API.addInsertion('publiiHead', this.headInsertion, 1, this)
		this.API.addInsertion('publiiFooter', this.footerInsertion, 1, this)
	}

    // CUSTOM CODE

    modifyHTML (rendererInstance, text) {
	/* Add slider in frontpage */

		const destination = this.isDestination(rendererInstance, this.config.destination)
		if (!destination) {
			//not home or blog page: exit without change
			return text
		}

		//analyze repeater field data
		const validImages = this.isValid(this.config.imageSlider)
		if (!validImages) {
			// exit if no valid images
			return text 
		}

		//personal HTML
		const myHtml = `
		<section class="home-slider">
			<div id="slider-01"></div>
		</section>
	`;
		//insert personal HTML after <main> or [myslider] tag

		if (this.config.sliderPosition == 1) {
			//after main
			text = text.replace(/<main(\s[^>]*)?>/, '<main$1>' + myHtml);
		} else {
			//after label
			text = text.replace("[PLUGIN-SLIDER]", myHtml);
		}

		//add personal HTML 
		return text
	}

	headInsertion(rendererInstance){
		const destination = this.isDestination(rendererInstance, this.config.destination)
		if (!destination) {
			//not home or blog page: exit without change
			return 
		}

		//analyze repeater field data
		const validImages = this.isValid(this.config.imageSlider)
		if (!validImages) {
			return ; // Exit if no valid images
		}

		const myStyle =
		`
			<style>
				#slider-01, #slider-01 img {
					height: calc(${this.config.sliderH})!important;
					object-fit: cover;
					object-position: center;
				}
				.vanilla-slider-text-overlay {
					text-shadow:none!important; 
					background-color:${this.config.textBgColor}!important; 
					max-width: calc(100% - 2 * ${this.config.textLeftRight});
				}
				.vanilla-slider-text-overlay * {
					color:${this.config.textColor}!important;
					margin: 0!important;
				}
				${this.config.customCSS}
			</style>
		`
		return minifyCSS(myStyle)

	}

	footerInsertion(rendererInstance){
	/* Add scripts in frontpage footer */

		const destination = this.isDestination(rendererInstance, this.config.destination)
		if (!destination) {
			return	//not home or blog page: exit without change
		}
		
		//extract repeater field data
		let slider=[];
		if (Array.isArray(this.config.imageSlider)) {
			this.config.imageSlider.forEach((elements) => {
				
				const validImage = this.isValid([elements])
				if (!validImage) {
					return; // no valid image: next element
				}

				const imageUrl = `${rendererInstance.siteConfig.domain}/media/plugins/${this.name}/${elements.image}`
				const textTitle = escapeHtml(elements.textTitle) || ''
				const textBody = escapeHtml(elements.textBody) || ''
				const alt = escapeHtml(elements.alt) || ''
				const title = escapeHtml(elements.title) || ''
				const textPosition = elements.textPosition
				const linkUrl = escapeUrl(elements.linkUrl) || ''
				const linkNewTab = elements.linkNewTab

				slider.push(`{
					imageUrl: '${imageUrl}',
					textTitle: '${textTitle}',
					textBody: '${textBody}',
					textPosition: '${textPosition}',
					linkUrl: '${linkUrl}',
					linkNewTab: ${linkNewTab},
					alt: '${alt}',
					title: '${title}'
				}`);
			});
	  	} else {
			//no data: exit without change
			return	"<script>console.log('*** FRONTPAGE SLIDER PLUGIN: No data')</script>" 
		}

		 const images = slider.join(',').replace(/\\/g,"/")
		 if (images == '') {
			//no images: exit without change
		 	return	"<script>console.log('*** FRONTPAGE SLIDER PLUGIN: No valid images')</script>"	
		 }

		let myJS = `
			var containerId = "slider-01";
			var options = {
				/* Options */
				transitionTime: ${this.config.transitionTime},
				transitionDirectionX: '${this.config.transitionDirectionX}',
				transitionDirectionY: '${this.config.transitionDirectionY}',
                transitionZoom: '${this.config.transitionZoom}',
				bullets: ${this.config.bullets},
                bulletColor: '${this.config.bulletColor}',
                bulletsHide: ${this.config.bulletsHide},
				arrows: ${this.config.arrows},
                arrowsHide: ${this.config.arrowsHide},
                swipe: ${this.config.swipe},
				auto: ${this.config.auto},
                autoTime: ${this.config.autoTime},
				
				/* Text */
				staticTextTitle: '${escapeHtml(this.config.staticTextTitle)}',
                staticTextBody: '${escapeHtml(this.config.staticTextBody)}',
                staticTextPosition: '${this.config.staticTextPosition}',
				textPadding: '${this.config.textPadding}',
				textLeftRight: '${this.config.textLeftRight}',
				textTopBottom: '${this.config.textTopBottom}',
				
				/* Slides */
				images:[
					${images}
				]
			};
			var slider = createSlider(containerId, options);
		`
		//minify
		myJS = minifyJS(myJS)
		
		//add script and link to JS file in footer
		return `
			<script src="${rendererInstance.siteConfig.domain}/media/plugins/${this.name}/vanilla-slider-publii.min.js"></script>
			<script>${myJS}</script>
			
		`	
	}

	isDestination(rendererInstance, destination) {
		const context = rendererInstance.globalContext.context;
	
		if (!Array.isArray(context)) return false;

		switch (destination) {
			//front page
			case "front":
				if (context.includes('post') || context.includes('page')) {
					const homeUrl = rendererInstance.globalContext.website.baseUrl;
					const pageUrl = rendererInstance.globalContext.website.pageUrl.replace(/\\/g,"/");
					return (homeUrl === pageUrl)? true: false;
				}
			
				if (context.includes('index')) {
					return true;
				}
				break;
			
			//blog page
			case "posts":
				if (context.includes('blogindex')) {
					return true;
				}
				break;
		}
		return false;
	}

	isValid(array) {
		// Define the list of valid file extensions for images
		const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
	
		// Check if the array is valid and contains at least one valid image
		return (
			Array.isArray(array) &&
			array.some((element) => {
				// Ensure element.image exists and extract its file extension
				const fileExtension = element.image?.toLowerCase().split('.').pop();
				// Return true if the file extension is in the valid extensions list
				return element.image && validExtensions.includes(fileExtension);
			})
		);
	}
}

function minifyCSS(code) {
    //Simple script to minify CSS
    return code
        .replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, '')  // Removes comments and newline
        .replace(/\s*([:;{}])\s*/g, '$1');                      // Removes unnecessary whitespace around : ; { }
} 

function minifyJS(code) {
    //Simple script to minify JS
    return code
        .replace(/\/\*[\s\S]*?\*\//g, '') 		// Remove multi-line comments
        //.replace(/\/\/.*?(\r?\n|$)/g, '') 		// Remove single-line comments (bad for URL)
        .replace(/\s*([{}();,:])\s*/g, '$1') 	// Remove whitespace around certain characters
        .replace(/\n{2,}/g, '\n') 				// Remove extra newlines
        .replace(/\s+/g, ' ') 					// Replace multiple spaces with a single space
        .trim(); 								// Trim leading and trailing whitespace
}

function escapeHtml(str) {
    if (typeof str !== "string") return str; // Return the input if it's not a string

    // Now, escape special characters as in the previous case
    str = str.replace(/[&<>"'`=\/]/g, function (char) {
        const escapeMap = {
            //"&": "&amp;", // Escape & symbol
            "<": "&lt;",  // Escape < symbol
            ">": "&gt;",  // Escape > symbol
            '"': "&quot;", // Escape " symbol
            "'": "&#39;", // Escape apostrophe '
            "`": "&#96;",  // Escape backtick `
            "=": "&#61;",  // Escape = symbol
            "/": "&#47;"   // Escape / symbol
        };
        return escapeMap[char] || char; // Return the corresponding entity for special characters
    });

    // Return the properly escaped string
    return str;
}

function escapeUrl(url) {
    if (typeof url !== "string") return url; // Return the input if it's not a string

    // Escape characters that could cause issues within href attributes
    url = url.replace(/[&<>"'`=]/g, function (char) {
        const escapeMap = {
            "&": "&amp;",  // Escape & symbol
            "<": "&lt;",   // Escape < symbol
            ">": "&gt;",   // Escape > symbol
            '"': "&quot;", // Escape " symbol
            "'": "&#39;",  // Escape apostrophe '
            "`": "&#96;",  // Escape backtick `
            "=": "&#61;"   // Escape = symbol
        };
        return escapeMap[char] || char; // Return the corresponding entity for special characters
    });

    // Return the escaped URL
    return url;
}

module.exports = VanillaSlider;