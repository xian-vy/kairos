import React, { useEffect } from 'react'

const useScreenSize = () => {
    const [screenSize, setScreenSize] = React.useState(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])
  return screenSize  < 768 ? 'mobile' : 'desktop'
}

export default useScreenSize