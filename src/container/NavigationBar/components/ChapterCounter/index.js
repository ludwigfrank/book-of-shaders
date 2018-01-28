import React from 'react'
import styled from 'react-emotion'
import Typography from '../../../../components/Typography'

const Wrapper = styled('div')`
  width: 100%;
  text-align: center;
  margin-top: 23px;
  & > * {
    margin-bottom: -4px;
  }
`

const ContentDescriptionWrapper = styled('div')`
  transform: rotate(90deg);
  margin-top: 48px ;
`


const ChapterCounter = ({}) => {
    return (
        <Wrapper>
            <Typography type='caption' tt='uppercase'> 02 </Typography>
            <Typography type='caption' tt='uppercase' color='disabled'> 06 </Typography>
            <ContentDescriptionWrapper>
                <Typography type='caption' tt='uppercase'> Content </Typography>
            </ContentDescriptionWrapper>
        </Wrapper>
    )
}

export default ChapterCounter