import 'package:appwrite/appwrite.dart';
import 'package:appwrite/enums.dart';
import 'package:appwrite/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

// Custom exception for Appwrite service errors
class AppwriteServiceException implements Exception {
  final String message;
  final String? code;
  final dynamic details;

  AppwriteServiceException(this.message, {this.code, this.details});

  @override
  String toString() => 'AppwriteServiceException: $message${code != null ? ' (Code: $code)' : ''}';
}

class AppwriteService extends ChangeNotifier {
  late final Client _client;
  late final Account _account;
  late final Databases _databases;
  late final Storage _storage;

  // Session management
  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;
  User? _currentUser;
  User? get currentUser => _currentUser;

  // Configuration
  final String appwriteUrl = dotenv.env['APPWRITE_URL'] ?? '';
  final String projectId = dotenv.env['PROJECT_ID'] ?? '';
  final String databaseId = dotenv.env['DATABASE_ID'] ?? '';
  final String collectionId = dotenv.env['COLLECTION_ID'] ?? '';
  final String bucketId = dotenv.env['BUCKET_ID'] ?? '';

  AppwriteService() {
    _validateConfig();
    _initializeClient();
  }

  void _validateConfig() {
    if (appwriteUrl?.isEmpty ?? true) throw AppwriteServiceException('APPWRITE_URL is not configured');
    if (projectId?.isEmpty ?? true) throw AppwriteServiceException('PROJECT_ID is not configured');
    if (databaseId?.isEmpty ?? true) throw AppwriteServiceException('DATABASE_ID is not configured');
    if (collectionId?.isEmpty ?? true) throw AppwriteServiceException('COLLECTION_ID is not configured');
    if (bucketId?.isEmpty ?? true) throw AppwriteServiceException('BUCKET_ID is not configured');
  }

  void _initializeClient() {
    try {
      _client = Client()
        ..setEndpoint(appwriteUrl!)
        ..setProject(projectId!)
        ..setSelfSigned(status: true);

      _account = Account(_client);
      _databases = Databases(_client);
      _storage = Storage(_client);
      _isInitialized = true;
    } catch (e) {
      throw AppwriteServiceException('Failed to initialize Appwrite client: $e');
    }
  }

  // Document operations
  Future<Document> createDocument(Map<String, dynamic> data) async {
    await _checkSession();

    try {
      final document = await _databases.createDocument(
        databaseId: databaseId!,
        collectionId: collectionId!,
        documentId: ID.unique(),
        permissions: [
          Permission.read(Role.user(data['user_id'])),
          Permission.write(Role.user(data['user_id'])),
        ],
        data: {
          'name': data['name'],
          'type': data['type'],
          'lyrics': data['lyrics'],
          'audio_url': data['audio_url'],
          'user_id': data['user_id'],
          'created_at': DateTime.now().toIso8601String(),
          'updated_at': DateTime.now().toIso8601String(),
        },
      );
      return document;
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to create document',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  Future<List<Document>> getDocuments({
    List<String>? queries,
    int? limit,
    int? offset,
  }) async {
    await _checkSession();

    try {
      final documents = await _databases.listDocuments(
        databaseId: databaseId!,
        collectionId: collectionId!,
        queries: queries,
      );
      return documents.documents;
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to retrieve documents',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  // File operations
  Future<File> uploadFile(String filePath) async {
    await _checkSession();

    try {
      final file = await _storage.createFile(
        bucketId: bucketId!,
        fileId: ID.unique(),
        file: InputFile.fromPath(path: filePath),
        permissions: [
          Permission.read(Role.user(currentUser?.$id ?? '')),
          Permission.write(Role.user(currentUser?.$id ?? '')),
        ],
      );
      return file;
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to upload file',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  // Authentication
  Future<void> signUp(String name, String email, String password) async {
  try {
    // Create user with specific parameters as strings
    final user = await _account.create(
      userId: ID.unique(),
      email: email,
      password: password,
      name: name,
      // Removed the roles parameter as it is not defined
    );
    print("User created: ${user.toMap()}"); // Add this debug line
    _currentUser = user;
    
    // Create a session immediately after signup
    await _account.createEmailPasswordSession(
      email: email,
      password: password,
    );
    
    notifyListeners();
  } on AppwriteException catch (e) {
    throw AppwriteServiceException(
      'Failed to sign up',
      code: e.code.toString(),
      details: e.message,
    );
  }
}

  Future<void> login(String email, String password) async {
    try {
      await _account.createEmailPasswordSession(
        email: email,
        password: password,
      );
      await loadCurrentUser();
      notifyListeners();
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to login',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  Future<void> logout() async {
    try {
      if (await checkSession()) {
        await _account.deleteSession(sessionId: 'current');
        _currentUser = null;
        notifyListeners();
      }
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to logout',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  Future<void> continueWithGoogle() async {
    try {
      await _account.createOAuth2Session(
        provider: OAuthProvider.google,
        scopes: ['profile', 'email'],
      );
      // await loadCurrentUser();
      notifyListeners();
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to authenticate with Google',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }

  // Session management
  Future<bool> checkSession() async {
    try {
      await _account.getSession(sessionId: 'current');
      return true;
    } on AppwriteException {
      return false;
    }
  }

  Future<void> _checkSession() async {
    if (!await checkSession()) {
      throw AppwriteServiceException('No active session. Please login first.');
    }
  }

  Future<void> loadCurrentUser() async {
    try {
      var session = await _account.getSession(sessionId: 'current');
      if (session == null) {
        throw AppwriteServiceException('No valid session found');
      }

      _currentUser = await _account.get();

      // Add debug log to inspect the fields
      print('Current User: $_currentUser');
      print('User email: ${_currentUser?.email}');
      // print('User roles: ${_currentUser?}');  // Add other fields as necessary
    } on AppwriteException catch (e) {
      throw AppwriteServiceException(
        'Failed to load user details',
        code: e.code.toString(),
        details: e.message,
      );
    }
  }



  @override
  void dispose() {
    _isInitialized = false;
    _currentUser = null;
    super.dispose();
  }
}