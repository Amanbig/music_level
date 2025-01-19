import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header Section
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome Back,',
                      style: GoogleFonts.poppins(
                        fontSize: 20,
                        color: Colors.grey[400],
                      ),
                    ).animate().fadeIn(delay: 300.ms, duration: 600.ms),
                    Text(
                      'Amanpreet 👋',
                      style: GoogleFonts.poppins(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ).animate().slideX(duration: 700.ms, curve: Curves.easeOut),
                  ],
                ),
              ),

              // Search Bar with Animation
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[900],
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: TextField(
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      hintText: 'Search for songs, artists, or albums...',
                      hintStyle: TextStyle(color: Colors.grey[500]),
                      prefixIcon: const Icon(Icons.search, color: Colors.white),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.all(16.0),
                    ),
                  ),
                ),
              ).animate().fadeIn(duration: 800.ms),

              const SizedBox(height: 20),

              // Categories Section with Animation
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Explore Categories',
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ).animate().fadeIn(duration: 600.ms, delay: 400.ms),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 150,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildCategoryCard('Pop', 'assets/pop.jpg', Colors.pink),
                    _buildCategoryCard('Rock', 'assets/rock.jpg', Colors.blue),
                    _buildCategoryCard('Jazz', 'assets/jazz.jpg', Colors.orange),
                    _buildCategoryCard('Hip-Hop', 'assets/hiphop.jpg', Colors.green),
                  ],
                ).animate(delay: 200.ms).slideX(curve: Curves.easeInOut),
              ),

              const SizedBox(height: 20),
              //
              // // Recommended Playlists
              // Padding(
              //   padding: const EdgeInsets.symmetric(horizontal: 16.0),
              //   child: Text(
              //     'Recommended Playlists 🎵',
              //     style: GoogleFonts.poppins(
              //       fontSize: 22,
              //       fontWeight: FontWeight.bold,
              //       color: Colors.white,
              //     ),
              //   ).animate().fadeIn(duration: 600.ms, delay: 500.ms),
              // ),
              // const SizedBox(height: 10),
              // SizedBox(
              //   height: 250,
              //   child: ListView(
              //     scrollDirection: Axis.horizontal,
              //     children: [
              //       _buildPlaylistCard('Chill Vibes', 'assets/chill.jpg'),
              //       _buildPlaylistCard('Workout Hits', 'assets/workout.jpg'),
              //       _buildPlaylistCard('Classical Gems', 'assets/classical.jpg'),
              //       _buildPlaylistCard('Party Anthems', 'assets/party.jpg'),
              //     ],
              //   ).animate(delay: 200.ms).slideX(curve: Curves.easeInOut),
              // ),
              //
              // const SizedBox(height: 20),

              // Trending Songs Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Trending Songs 🔥',
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ).animate().fadeIn(duration: 600.ms, delay: 700.ms),
              ),
              const SizedBox(height: 10),
              ListView.builder(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: 5,
                itemBuilder: (context, index) {
                  return _buildSongCard(
                    title: 'Song ${index + 1}',
                    artist: 'Artist ${index + 1}',
                    imageUrl: 'https://via.placeholder.com/150',
                  ).animate().fadeIn(delay: (index * 300).ms, duration: 600.ms);
                },
              ),
              const SizedBox(height: 20),

              // Featured Artists Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Text(
                  'Featured Artists 🌟',
                  style: GoogleFonts.poppins(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ).animate().fadeIn(duration: 600.ms, delay: 900.ms),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 120,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    _buildArtistCard('Taylor Swift', 'assets/taylor.jpg'),
                    _buildArtistCard('Ed Sheeran', 'assets/ed.jpg'),
                    _buildArtistCard('Adele', 'assets/adele.jpg'),
                    _buildArtistCard('BTS', 'assets/bts.jpg'),
                  ],
                ).animate(delay: 200.ms).slideX(curve: Curves.easeInOut),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Reusable Category Card
  Widget _buildCategoryCard(String title, String imageUrl, Color color) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0),
      child: Stack(
        children: [
          Container(
            width: 120,
            height: 150,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          Container(
            width: 120,
            height: 150,
            decoration: BoxDecoration(
              color: color.withOpacity(0.5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: Text(
                title,
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Reusable Playlist Card
  Widget _buildPlaylistCard(String title, String imageUrl) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0),
      child: Column(
        children: [
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  // Reusable Song Card
  Widget _buildSongCard({required String title, required String artist, required String imageUrl}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              imageUrl,
              width: 60,
              height: 60,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  artist,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    color: Colors.grey[500],
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.play_circle_fill, color: Colors.pink, size: 30),
          ),
        ],
      ),
    );
  }

  // Reusable Artist Card
  Widget _buildArtistCard(String name, String imageUrl) {
    return Padding(
      padding: const EdgeInsets.only(left: 16.0),
      child: Column(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundImage: AssetImage(imageUrl),
          ),
          const SizedBox(height: 8),
          Text(
            name,
            style: GoogleFonts.poppins(
              fontSize: 14,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}