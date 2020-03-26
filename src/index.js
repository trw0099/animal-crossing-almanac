import React from 'react';
import ReactDOM from 'react-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Button from 'react-bootstrap/Button';
import Animals from './data/NorthernAnimals.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFish, faBug } from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function Animal(props) {
    return (
        <Col md={4}>
            <Card bg={props.value.Type === "fish" ? "primary" : "success"} text="white">
                <Card.Header>
                    {props.value.Name}
                    <span className="float-right">
                        <FontAwesomeIcon icon={props.value.Type === "fish" ? faFish : faBug} />
                    </span>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{props.value.Location}<span className="float-right">${props.value.Price}</span></Card.Text>
                    <Card.Text>{props.value.TimesString}<span className="float-right">{props.value.SeasonsString}</span></Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

class AnimalList extends React.Component {
    constructor(props) {
        super(props);

        let sortedAnimals = [].concat(Animals)
            .sort((a, b) => {
                return b.Price - a.Price;
            });

        this.state = {
            animalList: sortedAnimals
        };
    }

    renderAnimal(i) {
        return <Animal
            key={i}
            value={this.state.animalList[i]}
        />;
    }

    checkTime(animal) {
        var validTime = false;
        var validMonth = false;

        if (animal.Times[0].All) {
            validTime = true;
        }
        else {
            animal.Times.map((time, i) => {
                if (time.Start < time.End && (time.Start <= this.props.hour && time.End >= this.props.hour)) {
                    validTime = true;
                }
                else if (time.Start > time.End && (time.Start <= this.props.hour || time.End >= this.props.hour)) {
                    validTime = true;
                }
            });
        }

        if (!validTime) {
            return false;
        }

        if (animal.Seasons[0].All) {
            return true;
        }
        else {
            animal.Seasons.map((season, i) => {
                if (season.Start < season.End && (season.Start <= this.props.month && season.End >= this.props.month)) {
                    validMonth = true;
                }
                else if (season.Start > season.End && (season.Start <= this.props.month || season.End >= this.props.month)) {
                    validMonth = true;
                }
            });
        }

        return validMonth;
    }

    sort(sortType) {
        let sortedAnimals = [].concat(Animals)
            .sort((a, b) => {
                if (sortType === "price") {
                    return b.Price - a.Price;
                }
                else if (sortType === "location") {
                    return a.Location - b.Location;
                }
                else {
                    return a.Name - b.Name;
                }
            });

        this.setState({
            animalList: sortedAnimals
        })
    }

    render() {
        return (
            <div>
                <Row>
                    {
                        this.state.animalList
                            .map((fish, i) => {
                                return this.checkTime(fish) ? this.renderAnimal(i) : '';
                            })
                    }
                </Row>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }),
            month: new Date().getMonth() + 1,
            hour: new Date().getHours()
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            60000
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({
            time: new Date().toLocaleString([], { dateStyle: 'long', timeStyle: 'short' }),
            month: new Date().getMonth() + 1,
            hour: new Date().getHours()
        });
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col md={6}>
                        <h1>Animal Crossing Almanac</h1>
                    </Col>
                    <Col md={6}>
                        <p className="float-right">
                            Current Time: <b>{this.state.time}</b>
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col className="mb-2">
                        <ToggleButtonGroup type="radio" name="options" defaultValue={'all'}>
                            <ToggleButton value={'all'} variant="secondary">All</ToggleButton>
                            <ToggleButton value={'fish'} variant="primary"><FontAwesomeIcon icon={faFish} /></ToggleButton>
                            <ToggleButton value={'insects'} variant="success"><FontAwesomeIcon icon={faBug} /></ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>
                <AnimalList month={this.state.month} hour={this.state.hour} />
            </Container>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
