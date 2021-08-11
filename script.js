const pageHeaderEL = document.querySelector('.main-page-header')

let buttonsThatWillHaveARippleEffect = null

const searchBoxCloserEL = document.querySelector('.search-box-closer')
const searchBoxExpanderEL = document.querySelector('.search-box-expander')

const mobileSafeAreaEL = document.querySelector('.mobile-safe-area')

const hamburguerButtonEL = document.querySelector('.hamburguer-button')
const sidebarEL = document.querySelector('.hamburguer-menu')
const buttonsThatCanToggleSectionsELs = [...document.querySelectorAll('.visible-button, .mobile-safe-area button')]

const alternativeMenuCloserEL = document.querySelector('.alternative-menu-closer')
const userRelatedSectionEL = document.querySelector('.user-related-section')
const subscribedChannelsSectionEL = document.querySelector('.subscribed-channels-section')
const [toggleHideMenuElementsInsideUserRelatedSectionButtonEL, toggleHideMenuElementsInsideSubscribedChannelsSectionButtonEL] 
    = [...document.querySelectorAll('.toggle-remove-button')]
const searchChannelsEL = document.querySelector('.seach-channels')
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

const pageSectionsELs = document.querySelectorAll('main > article')

const videosThumbnailsELs = [...document.querySelectorAll('.image')]

let currentPageSectionClassName = '.start-section'
let lastMainPaddingTopComputedValue = ''

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


function fillPlaylistsData(playlists) {
    const playlistSVG = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><g><path d="M3.67 8.67h14V11h-14V8.67zm0-4.67h14v2.33h-14V4zm0 9.33H13v2.34H3.67v-2.34zm11.66 0v7l5.84-3.5-5.84-3.5z"></path></g></svg>'
    
    playlists.forEach(string => {
        const buttonEL = document.createElement('button')
        buttonEL.innerHTML = 
            `
                ${playlistSVG}
                <p>${string}</p>
            `

        userRelatedSectionEL.insertBefore(buttonEL, toggleHideMenuElementsInsideUserRelatedSectionButtonEL)
    })
}

fillPlaylistsData(userData.playlists)


function fillSubscribedChannelsData(subscribedChannels) {
    subscribedChannels.forEach(innerArray => {
        const liEL = document.createElement('button')
        liEL.innerHTML =
            `
                <div></div>
                <p ${innerArray[1] ? ' class="addapt-element-for-symbol"' : ''}>${innerArray[0]}</p>
                ${innerArray[1] ? '<span class="unseen-content-symbol"></span>' : ''}
            `

        subscribedChannelsSectionEL.insertBefore(liEL, searchChannelsEL)
    })

    if ([...subscribedChannelsSectionEL.children].length < 11) {
        toggleHideMenuElementsInsideSubscribedChannelsSectionButtonEL.classList.add('display-none')
        return
    }
    toggleHideMenuElements(subscribedChannelsSectionEL, 8, "maxAmount-1", toggleHideMenuElementsInsideSubscribedChannelsSectionButtonEL, true)
}

fillSubscribedChannelsData(userData.subscribedChannels)


function fillKeywordsButtons() {
    userData.keywords.forEach(keyword => {
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
    defineThumbnailsHeight(true, [...document.querySelectorAll(`${currentPageSectionClassName} .image`)])
}


function getUserKeywordsSectionHeight() {
    userKeywordsSectionEL.classList.remove('display-none')
    const userKeywordsContainerHeight = userKeywordsSectionEL.offsetHeight
    userKeywordsSectionEL.classList.add('display-none')
    return userKeywordsContainerHeight
}


function adjustMainElementPaddingTop(sectionClassName, userKeywordsContainerHeight=0) {
    const mainEL = document.querySelector('main')
    mainEL.style.paddingTop = ''

    if (sectionClassName.indexOf('start-section') === -1) {
        const mainElementPaddingTop = getComputedStyle(mainEL)['padding-top']
        const parsedPaddingTop = parseFloat(mainElementPaddingTop.slice(0, mainElementPaddingTop.length - 2), 10)

        mainEL.style.paddingTop = parsedPaddingTop - (userKeywordsContainerHeight || getUserKeywordsSectionHeight()) + 'px'
    }
}


function toggleUserKeywordsSection(sectionClassName) {
    const userKeywordsSectionIsHidden = userKeywordsSectionEL.classList.contains('display-none')

    if (sectionClassName === 'start-section' && userKeywordsSectionIsHidden) {
        userKeywordsSectionEL.classList.remove('display-none')

        adjustMainElementPaddingTop(sectionClassName)
    }
    else if (sectionClassName !== 'start-section' && !userKeywordsSectionIsHidden) {
        const userKeywordsContainerHeight = userKeywordsSectionEL.offsetHeight
        userKeywordsSectionEL.classList.add('display-none')

        adjustMainElementPaddingTop(sectionClassName, userKeywordsContainerHeight)
    }
}


function showDesiredSection(sectionClassName) {
    const desiredSectionEL = document.querySelector(`.${sectionClassName}`)

    if (!desiredSectionEL) return

    currentPageSectionClassName = `.${sectionClassName}`

    pageSectionsELs.forEach(pageSectionsEL => pageSectionsEL.classList.add('display-none'))

    buttonsThatCanToggleSectionsELs.forEach((buttonEL) => {
        if (buttonEL.dataset.attachedSectionJs === sectionClassName) {
            buttonEL.classList.add('highlight-section-button')
            return
        }

        buttonEL.classList.remove('highlight-section-button')
    })

    desiredSectionEL.classList.remove('display-none')
    defineThumbnailsHeight(false, document.querySelectorAll(`.${sectionClassName} .image`))
    toggleUserKeywordsSection(sectionClassName)
}


function toggleHideMenuElements(fatherElement, limitationStart, limitationEnd, clickedButton, showExcedentsAmount) {
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

toggleHideMenuElements(userRelatedSectionEL, 5, "maxAmount-1", toggleHideMenuElementsInsideUserRelatedSectionButtonEL, false)


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

        window.addEventListener('scroll', handleScrollEventOnWindow)
    }
    else {
        clonnedHeaderNode.classList.add('display-none')
        pageHeaderEL.classList.remove('display-none')

        window.removeEventListener('scroll', handleScrollEventOnWindow)
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


function handleWheelEventOnKeywordsSection(event) {
    event.preventDefault()
    if (event.deltaY < 0) moveWrapperToLeft()
    else moveWrapperToRight()
}


function highlightKeywordsSectionButton(clickedButton) {
    const theButtonHasTheClass = clickedButton.classList.contains('highlight-button')

    keywordsButtonsELs.forEach(buttonEL => buttonEL.classList.remove('highlight-button'))

    if (theButtonHasTheClass) {
        keywordsButtonsELs[0].classList.add('highlight-button')
        return
    }

    clickedButton.classList.add('highlight-button')
}


function returnAspectedHeight(thumbnail) {
    const thumbnailWidth = thumbnail.clientWidth
    return thumbnailWidth / (16/9)
}


function defineThumbnailsHeight(analiseIfVideoCardsWillNeedToGetResized, thumbnails) {
    if (analiseIfVideoCardsWillNeedToGetResized) {
        const videoCardsWillNeedToBeResised = getComputedStyle(sidebarEL.parentElement).display === 'grid'

        if (!videoCardsWillNeedToBeResised) return
    }

    const aspectedHeight = returnAspectedHeight(thumbnails[0])

    thumbnails.forEach(thumbnail => {
        thumbnail.style.height = aspectedHeight + 'px'
    })
}

defineThumbnailsHeight(false, videosThumbnailsELs)


function callbackFunctionForContentLoaded() {
    setTimeout(() => {
        document.body.classList.remove('page-skeleton')
        toggleShowCloneOfMainPageHeader()
        hideArrows()
    }, 3000)
}


function callbackFunctionForResizing() {
    changeGridTemplateColumnsProperty()
    toggleShowCloneOfMainPageHeader()
    defineThumbnailsHeight(false, [...document.querySelectorAll(`${currentPageSectionClassName} .image`)])
    adjustMainElementPaddingTop(currentPageSectionClassName)
}


function handleScrollEventOnWindow() {
    const totalScrolledAmount = window.pageYOffset
    const theWrapperMustNotBeMoved = getComputedStyle(mobileSafeAreaEL).display === 'none'
    const minimumQuantityOfPixels = currentPageSectionClassName === '.start-section' ? 90 : 40

    if (theWrapperMustNotBeMoved) return

    if (totalScrolledAmount > minimumQuantityOfPixels) {
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

buttonsThatCanToggleSectionsELs.forEach((buttonEL, index) => 
    buttonEL.addEventListener('click', () => showDesiredSection(buttonEL.dataset.attachedSectionJs)))

toggleHideMenuElementsInsideUserRelatedSectionButtonEL
    .addEventListener('click', function() {toggleHideMenuElements(userRelatedSectionEL, 5, "maxAmount-1", this, false)})

toggleHideMenuElementsInsideSubscribedChannelsSectionButtonEL
    .addEventListener('click', function() {toggleHideMenuElements(subscribedChannelsSectionEL, 8, "maxAmount-1", this, true)})

hamburguerMenuBluredAreaEL.addEventListener('click', toggleExpandHamburguerMenu)

window.addEventListener('keydown', handleKeydownEventOnWindow)


userKeywordsSectionEL.addEventListener('wheel', handleWheelEventOnKeywordsSection)

moveButtonsToLeftEL.addEventListener('click', moveWrapperToLeft)

moveButtonsToRightEL.addEventListener('click', moveWrapperToRight)

keywordsButtonsELs.forEach(buttonEL => 
    buttonEL.addEventListener('click', () => highlightKeywordsSectionButton(buttonEL)))


window.addEventListener('DOMContentLoaded', callbackFunctionForContentLoaded)

window.addEventListener('resize', callbackFunctionForResizing)