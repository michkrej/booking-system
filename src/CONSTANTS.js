const currentDate = new Date('2023-08-15T00:00:00.000Z')
const views = ['timelineDay', 'timelineWeek', 'timelineMonth']
const adminError = 'Möjligheten att skapa och redigera planeringar har låsts av en administratör'

const color = {
  primary: '#670c47',
  primary75: '#670c47b5',
  primary50: '#670c4778',
  primary25: '#670c473b',
  secondary: '#bcdfd7',
  tertiary: '#818389'
}

const pages = [{ url: 'overview', name: 'Översikt' }]

export { currentDate, views, adminError, color, pages }
