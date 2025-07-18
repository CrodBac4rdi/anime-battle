# 🥊 Anime Battle Arena

Epic anime character battle game with real-time multiplayer action! Choose your favorite anime characters and battle against other players in this fullstack web application.

## ⚡ Features

- **8 Iconic Anime Characters**: Goku, Saitama, Naruto, Luffy, Ichigo, Light Yagami, Edward Elric, Eren Yeager
- **Real-time Battles**: WebSocket-powered live battles with immediate results
- **Live Statistics**: Real-time player count and battle statistics
- **Responsive Design**: Works perfectly on desktop and mobile
- **Battle History**: Track recent battles and top fighters
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Docker Deployment (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd anime-battle-arena

# Build and run with Docker Compose
docker-compose up -d

# Visit http://localhost:3000
```

### Manual Installation

```bash
# Install dependencies
npm run install-all

# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🎮 How to Play

1. **Choose Player 1**: Click on any character card to select your first fighter
2. **Choose Player 2**: Click on another character for your second fighter
3. **Battle**: Click the "🥊 BATTLE!" button to start the fight
4. **Results**: Watch the epic battle unfold and see who wins!
5. **Battle Again**: Click "🔄 Battle Again" to start a new fight

## 🏗️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Socket.io Client**: Real-time communication
- **CSS3**: Custom animations and responsive design
- **Orbitron Font**: Futuristic gaming aesthetic

### Backend
- **Node.js**: Server runtime
- **Express**: Web framework
- **Socket.io**: Real-time WebSocket communication
- **Helmet**: Security middleware
- **Express Rate Limit**: API protection

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Multi-stage builds**: Optimized production images
- **Health checks**: Container monitoring

## 🎯 Character Stats

| Character | Anime | Power | Speed | Defense | Special Move |
|-----------|-------|-------|-------|---------|--------------|
| Goku | Dragon Ball Z | 95 | 88 | 85 | Kamehameha |
| Saitama | One Punch Man | 100 | 90 | 80 | One Punch |
| Naruto | Naruto | 85 | 92 | 75 | Rasengan |
| Luffy | One Piece | 80 | 85 | 90 | Gum-Gum Pistol |
| Ichigo | Bleach | 88 | 87 | 82 | Getsuga Tensho |
| Light Yagami | Death Note | 60 | 70 | 65 | Death Note |
| Edward Elric | Fullmetal Alchemist | 78 | 80 | 75 | Alchemy |
| Eren Yeager | Attack on Titan | 90 | 75 | 85 | Titan Transformation |

## 🔧 Battle System

The battle system uses a combination of:
- **Base Stats**: Power, Speed, Defense values
- **Randomization**: Adds unpredictability to battles
- **Special Moves**: Each character has unique abilities
- **Score Calculation**: Complex algorithm determines the winner

## 🌐 Deployment

### Coolify Deployment

1. **Push to Git**: Ensure your code is in a Git repository
2. **Coolify Setup**: Connect your repository to Coolify
3. **Environment Variables**: Set `NODE_ENV=production` and `PORT=5000`
4. **Docker Build**: Coolify will automatically build using the Dockerfile
5. **Access**: Your app will be available at your Coolify domain

### Manual Docker Deployment

```bash
# Build the image
docker build -t anime-battle-arena .

# Run the container
docker run -p 3000:5000 anime-battle-arena
```

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: API protection
- **Input Validation**: Prevents invalid battles
- **CORS**: Configured for specific origins
- **Non-root User**: Docker container security

## 📊 API Endpoints

- `GET /api/characters` - Get all characters
- `GET /api/character/:id` - Get specific character
- `POST /api/battle` - Start a battle
- `GET /api/battles` - Get battle history
- `GET /api/stats` - Get game statistics

## 🔮 Future Enhancements

- [ ] User authentication and profiles
- [ ] Tournament mode
- [ ] Custom character creation
- [ ] Leaderboards
- [ ] Battle replays
- [ ] Power-ups and items
- [ ] Team battles
- [ ] AI opponents

## 📱 Mobile Support

The app is fully responsive and works great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🎨 Design Philosophy

- **Futuristic Aesthetic**: Orbitron font and gradient backgrounds
- **Smooth Animations**: CSS transitions and transforms
- **Intuitive UX**: Clear visual feedback and easy navigation
- **Accessibility**: Proper contrast ratios and keyboard navigation

## 🤝 Contributing

Feel free to contribute to this project! Whether it's:
- 🐛 Bug fixes
- ✨ New features
- 🎨 UI improvements
- 📚 Documentation
- 🧪 Testing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Anime creators for the amazing characters
- React and Node.js communities
- Socket.io for real-time capabilities
- Docker for containerization

---

**Ready to battle?** 🥊 Deploy your own Anime Battle Arena and let the epic fights begin!# anime-battle
