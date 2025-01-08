import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:music_level/services/appwrite_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _checkUserSession();
    });
  }

  Future<void> _checkUserSession() async {
    final appwriteService = Provider.of<AppwriteService>(context, listen: false);
    try {
      final isSessionActive = await appwriteService.getCurrentUser();
      if (!mounted) return;
      if (isSessionActive == Null) {
        Navigator.pushReplacementNamed(context, '/');
      } else {
        Navigator.pushReplacementNamed(context, '/login');
      }
    } catch (e) {
      print('Error during navigation: $e');
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/error'); // Optional error page
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(50),
              child: Image.asset(
                'assets/icon.jpg', // Ensure this path is correct
                width: MediaQuery.of(context).size.width * 0.45,
                height: MediaQuery.of(context).size.width * 0.45,
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            'Music Level',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          const CircularProgressIndicator(color: Colors.white),
        ],
      ),
    );
  }
}
