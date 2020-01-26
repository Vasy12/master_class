import React, {Component} from 'react';
import styles from './app.module.css';
import Icon from '@mdi/react';
import {
	mdiCheckboxBlankCircle,
	mdiPlay,
	mdiPause,
	mdiFastForward,
	mdiRewind,
} from '@mdi/js';

const PLAY_DURATION = 2000;

function Carousel(props) {
	return (
			<div className={ styles.carousel }>
				{
					props.children
				}
			</div>
	);
}

function Slides(props) {
	return (
			<div className={ styles.slides }>
				{
					props.children
				}
			</div>
	);
}

function Slide(props) {
	return (

			<img style={ {
				display: props.isCurrent ? 'block' : 'none',
			} } className={ styles.slide } src={ props.img } alt="slide"/>
	);
}

function Controls(props) {
	return (
			<div className={ styles.controls }>
				{
					props.children
				}
			</div>
	);
}

function SlidesNav(props) {
	return (
			<div className={ styles.slidesNav }>
				{
					props.children
				}
			</div>
	);
}

function IconButton(props) {
	return (
			<div { ...props } className={ styles.iconButton } style={ {
				opacity: props.focus ? 0.9 : 0.6,
			} }>
				<Icon path={ props.icon } color={ 'white' } { ...props }/>
			</div>
	);
}

function Spinner(props) {
	return <div className={ styles.loader } {...props}/>;
}

class App extends Component{
	constructor(props) {
		super(props);
		this.state = {
			isFetching: true,
			isPlaying: false,
			currentIndex: 0,
			slides: [],
		};
		this.timeoutId = null;
	}

	componentDidMount() {
		setTimeout(() => {
			fetch('/slides.json')
					.then(response => response.json())
					.then(slides => {
						this.setState({
							slides,
							isFetching: false,
						});
					});
		}, 2000);

	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);

		}
		if (this.state.isPlaying) {
			this.timeoutId = setTimeout(this.nextSlide, PLAY_DURATION);
		}
	}

	componentWillUnmount() {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}

	setIndex = (value) => {
		this.setState({
			currentIndex: value,
		});
	};

	nextSlide = () => {
		this.setState({
			currentIndex: ( this.state.currentIndex + 1 ) % this.state.slides.length,
		});
	};
	prevSlide = () => {
		this.setState({
			currentIndex: ( this.state.currentIndex - 1 + this.state.slides.length ) %
					this.state.slides.length,
		});
	};

	render() {
		return (
				<Carousel>
					<Slides>
						{
							this.state.isFetching ? ( <Spinner/> ) :
									this.state.slides.map((item, index) => {
										return (
												<Slide key={ index } img={ item }
												       isCurrent={ index === this.state.currentIndex }/>
										);
									})
						}
					</Slides>
					<SlidesNav>
						{ this.state.slides.map((item, index) => {
							return <IconButton onClick={ () => this.setIndex(index) }
							                   key={ index }
							                   focus={ index === this.state.currentIndex }
							                   size={ 1 }
							                   icon={ mdiCheckboxBlankCircle }
							/>;
						}) }
					</SlidesNav>
					<Controls>
						{
							<IconButton onClick={ () => {
								this.setState({
									isPlaying: !this.state.isPlaying,
								});
							} }
							            icon={ this.state.isPlaying ? mdiPause : mdiPlay }
							            size={ 3 }/>
						}

						<IconButton onClick={ this.prevSlide }
						            icon={ mdiRewind }
						            size={ 3 }/>
						<IconButton onClick={ this.nextSlide }
						            icon={ mdiFastForward }
						            size={ 3 }/>

					</Controls>

				</Carousel>
		);
	}

}

export default App;





