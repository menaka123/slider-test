import styled from 'styled-components';
import useMeasure from "react-use-measure";
import {useRef} from "react";
import {useSpring, animated} from "react-spring";
import {useDrag} from "react-use-gesture";
import clamp from 'lodash.clamp'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
`

const Container = styled.div`
  width: 60%;
  display: flex;
  max-width: 400px;
  margin: 0 20px;
`

const Tile = ({color, width, x, i}) => {
    const minX= i * -width
    const maxX = (i + 1) * -width

    const avSize = x.to({
        range: [maxX, minX, minX + width],
        output: [0.6, 1, 0.6],
        extrapolate: 'clamp',
    })

    return <animated.div style={{backgroundColor: color, width, height: 300, scale: avSize}}/>
}

const colors = ['blue', 'green', 'aqua', "blue", 'red', ]

const Slider = () => {
    const index = useRef(0)
    const [ref, { width }] = useMeasure()
    const [{x}, api] = useSpring(() => ({ x: 0 }))

    const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel }) => {

        if (active && distance > width / 2) {
            index.current = clamp(index.current + (xDir > 0 ? -1 : 1), 0, colors.length - 1)
            cancel()
        }

        if (active && distance < width/2) {
            api.start({
                x: index.current * -width + mx
            })
        }

        if (!active) {
            api.start({
                x: index.current * -width
            })
        }
    })

    return <Wrapper>
        <Container ref={ref}>
            <animated.div {...bind()}  style={{display: 'flex', x, touchAction: 'none'}} >
                {
                    colors.map((color, i) =>
                        <Tile
                            key={i}
                            i={i}
                            x={x}
                            color={color}
                            width={width}
                        />
                    )
                }
            </animated.div>
        </Container>
    </Wrapper>
}

export default Slider