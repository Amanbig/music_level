import 'package:flutter/material.dart';
import 'package:music_level/components/bottom_bar.dart';
import 'package:music_level/components/generate_loader.dart';
import 'package:music_level/pages/generate_page.dart';
import 'package:music_level/pages/home_page.dart';
import 'package:music_level/pages/music_preview_page.dart';

class MainScreen extends StatefulWidget {
  final String? cate;

  const MainScreen({Key? key, this.cate}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      HomePage(), // Pass category to HomePage if required
      Container(color: Colors.blue),
      GeneratePage(), // Placeholder for other screens
      MusicPreviewPage(
        musicType: 'Rock',
        lyrics: 'Hello',
        audioUrl: 'skldlskdl',
      ),
      // Container(color: Colors.yellow),
      LoadingAnimation(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background or current page content
          IndexedStack(
            index: _currentIndex,
            children: _screens,
          ),
          // Bottom Navigation Bar
          Positioned(
            bottom: 0,
            left: 50,
            right: 50,
            child: Container(
              // height: 60, // Adjusted height to match the compact bottom bar height
              decoration: BoxDecoration(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: DockingBar(
                currentIndex: _currentIndex,
                onSelect: (index) {
                  setState(() {
                    _currentIndex = index;
                  });
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}