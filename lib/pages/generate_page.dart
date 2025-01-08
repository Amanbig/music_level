import 'dart:io';
import 'package:control_style/control_style.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:music_level/components/generate_loader.dart';
import 'package:music_level/pages/music_preview_page.dart';
import 'package:music_level/services/appwrite_service.dart';
import 'package:music_level/services/gemini_service.dart';
import 'package:music_level/services/music_gen_service.dart';
import 'package:provider/provider.dart';

class GeneratePage extends StatefulWidget {
  const GeneratePage({super.key});

  @override
  State<GeneratePage> createState() => _GeneratePageState();
}

class _GeneratePageState extends State<GeneratePage>
    with SingleTickerProviderStateMixin {
  String? selectedMusicType;
  String inputMethod = 'Lyrics';
  final TextEditingController inputController = TextEditingController();
  bool isLoading = false;

  final List<String> musicTypes = [
    'Pop',
    'Rock',
    'Classical',
    'Hip-Hop',
    'Jazz',
    'Electronic',
    'Blues',
    'Country',
    'Reggae',
    'Metal',
  ];
  final musicGenService = MusicGenerationService();

  late AnimationController controller;
  late Tween<double> tween;
  late Animation<double> animation;

  @override
  void initState() {
    super.initState();
    controller =
        AnimationController(duration: const Duration(seconds: 3), vsync: this);
    tween = Tween<double>(begin: 0, end: 359);
    animation = controller.drive(tween);

    controller.forward();
    controller.repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    final appwriteService = Provider.of<AppwriteService>(context, listen: false);

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text(
          'Generate Music',
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.black,
        elevation: 0,
      ),
      body: SafeArea(
        child: isLoading
            ? LoadingAnimation()
            : Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Select Music Type Dropdown
                    Text(
                      'Select Music Type:',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: Colors.grey[900],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: DropdownButton<String>(
                        hint: Text(
                          'Select a type',
                          style: GoogleFonts.poppins(color: Colors.white),
                        ),
                        value: selectedMusicType,
                        onChanged: (newValue) {
                          setState(() {
                            selectedMusicType = newValue;
                          });
                        },
                        dropdownColor: Colors.grey[900],
                        style: GoogleFonts.poppins(color: Colors.white),
                        items: musicTypes
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        isExpanded: true,
                        underline: SizedBox.shrink(),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Input Method Section
                    Text(
                      'Input Method:',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Radio<String>(
                          value: 'Lyrics',
                          groupValue: inputMethod,
                          onChanged: (value) {
                            setState(() {
                              inputMethod = value!;
                            });
                          },
                          activeColor: Colors.pink,
                        ),
                        Text(
                          'Lyrics',
                          style: GoogleFonts.poppins(color: Colors.white),
                        ),
                        const SizedBox(width: 20),
                        Radio<String>(
                          value: 'Topic',
                          groupValue: inputMethod,
                          onChanged: (value) {
                            setState(() {
                              inputMethod = value!;
                            });
                          },
                          activeColor: Colors.pink,
                        ),
                        Text(
                          'Topic',
                          style: GoogleFonts.poppins(color: Colors.white),
                        ),
                      ],
                    ),

                    const SizedBox(height: 20),

                    // Input Field for Lyrics or Topic
                    Text(
                      'Enter $inputMethod:',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: inputController,
                      style: const TextStyle(color: Colors.white),
                      maxLines: inputMethod == 'Lyrics'
                          ? 4
                          : 2, // Increase lines for Lyrics
                      minLines: 1, // Allow a minimum of 1 line for Topic
                      decoration: InputDecoration(
                        hintText: 'Type your $inputMethod here...',
                        hintStyle: TextStyle(color: Colors.grey[500]),
                        filled: true,
                        fillColor: Colors.grey[900],
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.all(16.0),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Glowing Animated Generate Button
                    Center(
                        child: TextButton(
                      onPressed: () async {
                        // Handle generation logic
                        final musicType = selectedMusicType ?? 'Any';
                        final input = inputController.text;
                        final method = inputMethod;
                        if (input.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Please enter some input!'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }
                        setState(() {
                          isLoading = true;
                        });

                        String lyrics = input;
                        if (method == 'Topic') {
                          lyrics = await generateLyrics(
                              'Generate  song lyrics matching this topic: $input');
                        }

                        final outputFilePath =
                            '${Directory.systemTemp.path}/generated_music.mp3'; // Adjust the path as necessary
                        try {
                          final musicFilePath =
                              await musicGenService.generateMusicFromLyrics(
                                  'Generate a $musicType song matching these lyrics: \n$lyrics',
                                  outputFilePath);
                          if (mounted) {
                            var uploadedfile = await appwriteService.uploadFile(musicFilePath);
                            print(uploadedfile);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                              builder: (context) => MusicPreviewPage(
                                musicType: musicType,
                                lyrics: lyrics,
                                audioUrl: musicFilePath,
                              ),
                              ),
                            );
                          }
                        } catch (e) {
                          if (mounted) {
                            showDialog(
                              context: context,
                              builder: (_) => AlertDialog(
                                title: const Text('Error'),
                                content: Text(
                                    'An error occurred while generating music: $e'),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('OK'),
                                  ),
                                ],
                              ),
                            );
                          }
                        } finally {
                          if (mounted) {
                            setState(() {
                              isLoading = false;
                            });
                          }
                        }
                      },
                      style: TextButton.styleFrom(
                        fixedSize: const Size(300, 50),
                        shape: DecoratedOutlinedBorder(
                          shadow: [
                            GradientShadow(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.topRight,
                                colors:
                                    _generateGradientColors(animation.value),
                                stops: _generateGradientStops(),
                              ),
                              offset: const Offset(-4, 4),
                              blurRadius: 12,
                              spreadRadius: 2,
                            ),
                          ],
                          child: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      child: Text(
                        "Generate Music",
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w300,
                          color: Colors.white,
                        ),
                      ),
                    )),

                    const Spacer(),
                  ],
                ),
              ),
      ),
    );
  }

  List<Color> _generateGradientColors(double offset) {
    List<Color> colors = [];
    const int divisions = 10;
    for (int i = 0; i < divisions; i++) {
      double hue = (360 / divisions) * i;
      hue += offset;
      if (hue > 360) {
        hue -= 360;
      }
      final Color color = HSVColor.fromAHSV(1.0, hue, 1.0, 1.0).toColor();
      colors.add(color);
    }
    colors.add(colors[0]);
    return colors;
  }

  List<double> _generateGradientStops() {
    const int divisions = 10;
    List<double> stops = [];
    for (int i = 0; i <= divisions; i++) {
      stops.add(i / divisions);
    }
    return stops;
  }
}
