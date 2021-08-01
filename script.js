const pageHeaderEL = document.querySelector('.main-page-header')

let buttonsThatWillHaveARippleEffect = null

const searchBoxCloserEL = document.querySelector('.search-box-closer')
const searchBoxExpanderEL = document.querySelector('.search-box-expander')

const mobileSafeAreaEL = document.querySelector('.mobile-safe-area')

const hamburguerButtonEL = document.querySelector('.hamburguer-button')
const sidebarEL = document.querySelector('.hamburguer-menu')

const alternativeMenuCloserEL = document.querySelector('.alternative-menu-closer')
const userRelatedSectionEL = document.querySelector('.user-related-section')
const subscribedChannelsSectionEL = document.querySelector('.subscribed-channels-section')
const [toggleRemoveElementsInsideUserRelatedSectionButtonEL, toggleRemoveElementsInsideSubscribedChannelsSectionButtonEL] 
    = [...document.querySelectorAll('.toggle-remove-button')]
const searchChannelsLiEL = document.querySelector('.seach-channels-li')
const hamburguerMenuBluredAreaEL = document.querySelector('.stretched-blured-area')

let lastKnownScrolledAmount = null

const userKeywordsContainerWrapperEL = document.querySelector('.user-keywords-container-wrapper')
const userKeywordsSectionEL = document.querySelector('.user-keywords-container')
const keywordsWrapperEL = document.querySelector('.keywords-wrapper')
const moveButtonsToLeftWrapperEL = document.querySelector('.move-to-left-wrapper')
const moveButtonsToRightWrapperEL = document.querySelector('.move-to-right-wrapper')
const moveButtonsToLeftEL = document.querySelector('.move-to-left')
const moveButtonsToRightEL = document.querySelector('.move-to-right')
let slidedPath = 0

const videosThumbnailsELs = [...document.querySelectorAll('.image')]

const userData = {
    playlists:
        ['Músicas', 'Estudos', 'Debates'],
    subscribedChannels:
        [
            ['Café e Política', true], 
            ['Minecraft World', false],
            ['Debate Filosófico', false],
            ['Aprenda Direito', true],
            ['MaxMRM GAMEPLAY', true],
            ['Marvel Studios', false],
            ['MemerMan', true],
            ['Elektronomia', true],
            ['NoCopyrightSongs', false]
        ],
    keywords:
        [
            'Mixes', 'Músicas', 'Cascading Style Sheets', "Five Nights at Freed's", 'Dying Light', 'DayZ', 'Dance/Eletrônica',
            'Zumbi', 'Synthwave', 'Dragon Ball', 'Jogos Eletrônicos Independentes', 'Dark Souls 3'
        ]
}


function fillPlaylistData(playlists) {
    const playlistSVG = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><g><path d="M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z"></path></g></svg>'
    
    playlists.forEach(string => {
        const liEL = document.createElement('li')
        liEL.innerHTML = 
            `<button>
                ${playlistSVG}
                <p>${string}</p>
            </button>`

        userRelatedSectionEL.insertBefore(liEL, toggleRemoveElementsInsideUserRelatedSectionButtonEL.parentElement)
    })
}

fillPlaylistData(userData.playlists)


function fillSubscribedChannelsData(subscribedChannels) {
    subscribedChannels.forEach(innerArray => {
        const liEL = document.createElement('li')
        liEL.innerHTML =
            `<button>
                <div></div>
                <p ${innerArray[1] ? ' class="addapt-element-for-symbol"' : ''}>${innerArray[0]}</p>
                ${innerArray[1] ? '<span class="unseen-content-symbol"></span>' : ''}
            </button>`

        subscribedChannelsSectionEL.insertBefore(liEL, searchChannelsLiEL)
    })

    if ([...subscribedChannelsSectionEL.children].length < 11) {
        toggleRemoveElementsInsideSubscribedChannelsSectionButtonEL.classList.add('display-none')
        return
    }
    toggleRemoveElements(subscribedChannelsSectionEL, 8, "maxAmount-1", toggleRemoveElementsInsideSubscribedChannelsSectionButtonEL, true)
}

fillSubscribedChannelsData(userData["subscribedChannels"])


function fillKeywordsButtons() {
    userData.keywords.forEach((keyword, index) => {
     keywordsWrapperEL.innerHTML += `<button>${keyword}</button>`
    })
}

fillKeywordsButtons()

const keywordsButtonsELs = [...keywordsWrapperEL.children]


function createRipple() {
    const interactedButtonEL = this

    interactedButtonEL.classList.remove('dissipate-ripple')
    interactedButtonEL.classList.add('create-ripple')
}


function removeRippleIfElementContainsClass() {
    const interactedButtonEL = this

    if (interactedButtonEL.classList.contains('create-ripple')) {
        interactedButtonEL.classList.remove('create-ripple')
        interactedButtonEL.classList.add('dissipate-ripple')
        interactedButtonEL.blur()
    }
}


function removeRipple() {
    const interactedButtonEL = this

    interactedButtonEL.classList.remove('create-ripple')
    interactedButtonEL.classList.add('dissipate-ripple')
    interactedButtonEL.blur()
}


function toggleExpandSearchBox() {
    const elementsToBeRemoved = [...document.querySelectorAll('.main-page-header > :not(.search-box-container)')]
    const searchBoxContainerELs = document.querySelectorAll('.search-box-container')

    elementsToBeRemoved.forEach(element => element.classList.toggle('display-none'))

    searchBoxContainerELs.forEach(searchBoxContainerEL => searchBoxContainerEL.classList.toggle('expand-search-box'))
}


function toggleExpandHamburguerMenu() {
    sidebarEL.classList.toggle('expanded-hamburguer-menu')

    changeGridTemplateColumnsProperty()
    defineThumbnailsHeight()
}


function toggleRemoveElements(fatherElement, limitationStart, limitationEnd, clickedButton, showExcedentsAmount) {
    const childrenELs = [...fatherElement.children]

    const clickedButtonChildren = clickedButton.children
    const clickedButtonSVG = clickedButtonChildren[0]
    const clickdedButtonContent = clickedButtonChildren[1]

    if (limitationEnd === "maxAmount-1") limitationEnd = childrenELs.length - 2

    if (showExcedentsAmount) {
        removedElementCount = 0
    }

    childrenELs.forEach((childEL, index) => {
        if (index >= limitationStart && index <= limitationEnd) {
            childEL.classList.toggle('display-none')
            if (showExcedentsAmount) removedElementCount++
        }

        if (index === limitationEnd) {
            switch (childEL.classList.contains('display-none')) {
                case true:
                    clickedButtonSVG.classList.remove('rotate-90-deg')
                    clickdedButtonContent.innerText = `Mostrar mais ${showExcedentsAmount ? removedElementCount : ''}`
                    break
                    
                case false:
                    clickedButtonSVG.classList.add('rotate-90-deg')
                    clickdedButtonContent.innerText = `Mostrar menos ${showExcedentsAmount ? removedElementCount : ''}`
                    break
            }
        }
    })
}

toggleRemoveElements(userRelatedSectionEL, 5, "maxAmount-1", toggleRemoveElementsInsideUserRelatedSectionButtonEL, false)


function changeGridTemplateColumnsProperty() {
    const sidebarParentIsAGridContainer = getComputedStyle(sidebarEL.parentElement).display === 'grid'
    const sidebarWidth = sidebarEL.clientWidth + 'px'

    if (sidebarParentIsAGridContainer) {
        sidebarEL.parentElement.style.gridTemplateColumns = sidebarWidth + ' 1fr'
        userKeywordsSectionEL.style.left = sidebarWidth
    }
    else {
        userKeywordsSectionEL.style.left = '0px'
    }
}

changeGridTemplateColumnsProperty()


function handleKeydownEventOnWindow(event) {
    const EscapeKeyWasPressed = event.key === 'Escape'
    const ArrowLeftWasPressed = 'ArrowLeft'.includes(event.key)
    const ArrowRightWasPressed = 'ArrowRight'.includes(event.key)

    if (EscapeKeyWasPressed) toggleExpandHamburguerMenu()
    else if (ArrowLeftWasPressed) moveWrapperToLeft()
    else if (ArrowRightWasPressed) moveWrapperToRight()
}


function createCloneOfMainPageHeader() {
    userKeywordsContainerWrapperEL.insertBefore(pageHeaderEL.cloneNode(true), userKeywordsSectionEL)

    buttonsThatWillHaveARippleEffect = 
        document.querySelectorAll('.main-page-header button, .alternative-header-for-menu > button, .move-to-right, .move-to-left, .mobile-safe-area button')
}

createCloneOfMainPageHeader()


function toggleShowCloneOfMainPageHeader() {
    const clonnedNodeMustBeDisplayed = getComputedStyle(mobileSafeAreaEL).display !== 'none'
    const clonnedHeaderNode = userKeywordsContainerWrapperEL.children[0]

    if (clonnedNodeMustBeDisplayed) {
        clonnedHeaderNode.classList.remove('display-none')
        pageHeaderEL.classList.add('display-none')
    }
    else {
        clonnedHeaderNode.classList.add('display-none')
        pageHeaderEL.classList.remove('display-none')
    }
}


function hideArrows() {
    const maxVisibleWidth = keywordsWrapperEL.scrollWidth - keywordsWrapperEL.clientWidth
    const slidedPathIsGreaterOrEqualToMaxVisibleWidth = slidedPath >= maxVisibleWidth
    const keywordsWrapperIsSmallerThanItsContainer = keywordsWrapperEL.scrollWidth < userKeywordsSectionEL.clientWidth

    if (!slidedPath) {
        moveButtonsToLeftWrapperEL.classList.add('hide-element')
    }
    else {
        moveButtonsToLeftWrapperEL.classList.remove('hide-element')
    }

    if (slidedPathIsGreaterOrEqualToMaxVisibleWidth || keywordsWrapperIsSmallerThanItsContainer) {
        moveButtonsToRightWrapperEL.classList.add('hide-element')
    }
    else {
        moveButtonsToRightWrapperEL.classList.remove('hide-element')
    }
}


function moveWrapperToLeft() {
    slidedPath -= 250

    if (slidedPath < 0) slidedPath = 0

    keywordsWrapperEL.style.transform = `translateX(-${slidedPath}px)`

    hideArrows()
}


function moveWrapperToRight() {
    const maxVisibleWidth = keywordsWrapperEL.scrollWidth - keywordsWrapperEL.clientWidth
    slidedPath += 250

    if (slidedPath > maxVisibleWidth) {
        slidedPath = maxVisibleWidth
    }
    
    keywordsWrapperEL.style.transform = `translateX(-${slidedPath}px)`

    hideArrows()
}


function returnAspectedHeight(thumbnail) {
    const parentElementWidth = thumbnail.clientWidth
    return parentElementWidth / (16/9)
}


function handleWheelEventOnKeywordsSection(event) {
    event.preventDefault()
    if (event.deltaY < 0) moveWrapperToLeft()
    else moveWrapperToRight()
}


function highlightButton(clickedButton) {
    const theButtonHasTheClass = clickedButton.classList.contains('highlight-button')

    keywordsButtonsELs.forEach(buttonEL => buttonEL.classList.remove('highlight-button'))

    if (theButtonHasTheClass) {
        keywordsButtonsELs[0].classList.add('highlight-button')
        return
    }

    clickedButton.classList.add('highlight-button')
}


function defineThumbnailsHeight() {
    const aspectedHeight = returnAspectedHeight(videosThumbnailsELs[0])

    videosThumbnailsELs.forEach(thumbnail => {
        thumbnail.style.height = aspectedHeight + 'px'
    })
}


function callbackFunctionForContentLoaded() {
    defineThumbnailsHeight()

    setTimeout(() => {
        document.body.classList.remove('page-skeleton')
        toggleShowCloneOfMainPageHeader()
        hideArrows()
    }, 3000)
}


function callbackFunctionForResizing() {
    changeGridTemplateColumnsProperty()
    toggleShowCloneOfMainPageHeader()
    defineThumbnailsHeight()
}


function handleScrollEventOnWindow() {
    const totalScrolledAmount = window.pageYOffset
    const theWrapperMustNotBeMoved = getComputedStyle(mobileSafeAreaEL).display === 'none'

    if (theWrapperMustNotBeMoved) return

    if (totalScrolledAmount > 80) {
        lastKnownScrolledAmount < totalScrolledAmount ?
        userKeywordsContainerWrapperEL.classList.add('transform-102-pixels') :
        userKeywordsContainerWrapperEL.classList.remove('transform-102-pixels')
    }
    else userKeywordsContainerWrapperEL.classList.remove('transform-102-pixels')

    lastKnownScrolledAmount = totalScrolledAmount
}


buttonsThatWillHaveARippleEffect.forEach(buttonEL => {
    buttonEL.addEventListener('mousedown', createRipple)
    buttonEL.addEventListener('touchstart', createRipple)

    buttonEL.addEventListener('mouseout', removeRippleIfElementContainsClass)
    buttonEL.addEventListener('mouseup', removeRipple)
    buttonEL.addEventListener('touchend', removeRipple)
})


alternativeMenuCloserEL.addEventListener('click', toggleExpandHamburguerMenu)

hamburguerButtonEL.addEventListener('click', toggleExpandHamburguerMenu)

toggleRemoveElementsInsideUserRelatedSectionButtonEL
    .addEventListener('click', function() {toggleRemoveElements(userRelatedSectionEL, 5, "maxAmount-1", this, false)})

toggleRemoveElementsInsideSubscribedChannelsSectionButtonEL
    .addEventListener('click', function() {toggleRemoveElements(subscribedChannelsSectionEL, 8, "maxAmount-1", this, true)})

hamburguerMenuBluredAreaEL.addEventListener('click', toggleExpandHamburguerMenu)

window.addEventListener('keydown', handleKeydownEventOnWindow)


userKeywordsSectionEL.addEventListener('wheel', handleWheelEventOnKeywordsSection)

moveButtonsToLeftEL.addEventListener('click', moveWrapperToLeft)

moveButtonsToRightEL.addEventListener('click', moveWrapperToRight)

keywordsButtonsELs.forEach(buttonEL => 
    buttonEL.addEventListener('click', () => highlightButton(buttonEL)))


window.addEventListener('DOMContentLoaded', callbackFunctionForContentLoaded)

window.addEventListener('resize', callbackFunctionForResizing)

window.addEventListener('scroll', handleScrollEventOnWindow)
