import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:music_level/pages/auth/login_page.dart';
import 'package:music_level/pages/auth/signup_page.dart';
import 'package:music_level/pages/main_screen.dart';
import 'package:music_level/pages/splash_screen.dart';
import 'package:music_level/services/appwrite_service.dart';
import 'package:provider/provider.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
        DeviceOrientation.portraitUp,
        DeviceOrientation.portraitDown,
]);
  // Load environment variables
  await dotenv.load(fileName: ".env");
  runApp(
  MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_)=>AppwriteService())
    ],
    child: MyApp(),
  )
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Music Level',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.black),
        useMaterial3: true,
      ),
      initialRoute: '/login', // Set initial route to Login page
      routes: {
        '/': (context) => const MainScreen(),
        '/login': (context) => LoginPage(),
        '/signup': (context) => SignUpPage(),
        '/loading': (context) => SplashScreen(),
      },
    );
  }
}
